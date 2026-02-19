import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { analyzeJD } from '../../lib/analyzer';
import { useJobHistory } from '../../hooks/useJobHistory';
import ReadinessCircle from '../dashboard/ReadinessCircle';
import { CheckCircle2, ChevronRight, HelpCircle, Copy, Download, ArrowRight, AlertCircle, Building } from 'lucide-react';
import { cn } from '../../lib/utils';

const JobAnalysis = () => {
    const [searchParams] = useSearchParams();
    const historyId = searchParams.get('id');
    const { saveEntry, getEntry, updateEntry } = useJobHistory();

    const [input, setInput] = useState({ company: '', role: '', text: '' });
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('plan'); // plan, checklist, questions

    // Interactive State
    const [skillConfidence, setSkillConfidence] = useState({}); // { skillName: 'know' | 'practice' }
    const [liveScore, setLiveScore] = useState(0);

    // Initialize state from history entry
    useEffect(() => {
        if (historyId) {
            const entry = getEntry(historyId);
            if (entry) {
                setResult(entry);
                setInput({ company: entry.company || '', role: entry.role || '', text: entry.jdText || '' });

                // Initialize confidence map if it exists, else default to 'practice'
                if (entry.skillConfidenceMap && Object.keys(entry.skillConfidenceMap).length > 0) {
                    setSkillConfidence(entry.skillConfidenceMap);
                } else if (entry.skillConfidence) {
                    // Legacy fallback
                    setSkillConfidence(entry.skillConfidence);
                } else {
                    const initialConfidence = {};
                    // Handle both structure types (array of strings vs object with arrays)
                    // New schema: extractedSkills is object { CoreCS: [], ... }
                    Object.values(entry.extractedSkills).flat().forEach(skill => {
                        if (typeof skill === 'string') initialConfidence[skill] = 'practice';
                    });
                    setSkillConfidence(initialConfidence);
                }

                // Set initial score 
                // Prefer finalScore (new) -> liveScore (legacy) -> baseScore (new) -> readinessScore (legacy)
                const score = entry.finalScore ?? entry.liveScore ?? entry.baseScore ?? entry.readinessScore;
                setLiveScore(score);
            }
        }
    }, [historyId, getEntry]);

    // Recalculate score and persist when confidence changes
    // Recalculate score and persist when confidence changes
    useEffect(() => {
        if (!result) return;

        let scoreChange = 0;

        Object.values(skillConfidence).forEach(status => {
            if (status === 'know') scoreChange += 2;
            else if (status === 'practice') scoreChange -= 2;
        });

        // Base score min 0 max 100
        // Use result.baseScore if available (new schema), else fallback to readinessScore
        const base = result.baseScore !== undefined ? result.baseScore : result.readinessScore;
        const newScore = Math.max(0, Math.min(100, base + scoreChange));

        // Avoid loop: only update state if different
        if (newScore !== liveScore) {
            setLiveScore(newScore);
        }

        // Persist to history if it's an existing entry and data has changed
        if (result.id) {
            const updatedEntry = {
                ...result,
                skillConfidence,
                finalScore: newScore,
                updatedAt: new Date().toISOString()
            };

            // Debounce or check before calling expensive storage op?
            // For now, simple check: is this different from result?
            // (Assuming result in state is the "source of truth" from load)
            // Ideally we'd compare deeply, but updateEntry handles array replace.

            // To prevent infinite loop with result dependency, we only update if 
            // the confidence map or score is actually different from what's in 'result'.
            // Note: 'result' is the state from getEntry or initial analyze.

            // Check if confidence changed from result's stored confidence
            const hasChanged = JSON.stringify(result.skillConfidence) !== JSON.stringify(skillConfidence);

            if (hasChanged) {
                updateEntry(updatedEntry);
                // IMPORTANT: Update local result state so we don't save again immediately
                // effectively syncing local state with "saved" state logic logic
                // setResult(updatedEntry); // This might cause re-render loop if not careful.
                // Actually updateEntry updates the hook state, but not this component's local result state 
                // unless we re-fetch. But we want live updates.
            }
        }

    }, [skillConfidence, result?.baseScore, result?.readinessScore]); // Depend on confidence map

    const handleAnalyze = () => {
        if (!input.text.trim()) return;
        const analysis = analyzeJD(input.text, input.company, input.role);

        // Init confidence
        const initialConfidence = {};
        Object.values(analysis.extractedSkills).flat().forEach(skill => {
            if (typeof skill === 'string') initialConfidence[skill] = 'practice';
        });

        const entry = {
            ...analysis,
            skillConfidenceMap: initialConfidence,
            finalScore: analysis.baseScore
        };

        setResult(entry);
        setSkillConfidence(initialConfidence);
        setLiveScore(analysis.baseScore);
        saveEntry(entry);
    };

    const toggleSkill = (skill) => {
        setSkillConfidence(prev => ({
            ...prev,
            [skill]: prev[skill] === 'know' ? 'practice' : 'know'
        }));
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        alert(`${label} copied to clipboard!`);
    };

    const downloadTxt = () => {
        if (!result) return;

        const content = `
PLACEMENT PREP PLAN
Role: ${result.role || 'N/A'}
Company: ${result.company || 'N/A'}
Readiness Score: ${liveScore}/100
${result.companyIntel ? `
COMPANY INTEL:
Type: ${result.companyIntel.type}
Size: ${result.companyIntel.size}
Focus: ${result.companyIntel.focus}
` : ''}

SKILLS:
${Object.entries(result.extractedSkills).map(([cat, skills]) =>
            `${cat}: ${skills.map(s => `${s} (${skillConfidence[s]})`).join(', ')}`
        ).join('\n')}

7-DAY PLAN:
${result.plan.map(d => `Day ${d.day}: ${d.title}\n${d.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n')}

CHECKLIST:
CHECKLIST:
${result.rounds
                ? result.rounds.map(r => `${r.name}\nDescription: ${r.description}\nWhy it matters: ${r.whyMatters}`).join('\n\n')
                : Object.entries(result.checklist).map(([round, items]) => `${round}:\n${items.map(i => `- ${i}`).join('\n')}`).join('\n\n')}

QUESTIONS:
${result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prep-plan-${result.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!result) {
        // Input Mode (Same as before)
        const isTooShort = input.text.length > 0 && input.text.length < 200;

        return (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Job Analysis</h1>
                    <p className="text-slate-500 mt-2">Paste a Job Description to generate a tailored preparation plan.</p>
                </div>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Company (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="e.g. Google"
                                    value={input.company}
                                    onChange={(e) => setInput({ ...input, company: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Role (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="e.g. Frontend Engineer"
                                    value={input.role}
                                    onChange={(e) => setInput({ ...input, role: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Job Description *</label>
                            <textarea
                                className={cn(
                                    "w-full h-64 p-3 border rounded-lg focus:ring-2 outline-none resize-none transition-colors",
                                    isTooShort ? "border-amber-300 focus:border-amber-400 focus:ring-amber-200 bg-amber-50/30" : "border-slate-200 focus:ring-primary/20 focus:border-primary"
                                )}
                                placeholder="Paste the full job description here..."
                                value={input.text}
                                onChange={(e) => setInput({ ...input, text: e.target.value })}
                            />
                            {isTooShort && (
                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    This JD is too short (less than 200 chars). Paste full JD for better output.
                                </p>
                            )}
                        </div>

                        <Button onClick={handleAnalyze} className="w-full md:w-auto" disabled={!input.text.trim()}>
                            Analyze Job Description
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const weakSkills = Object.entries(skillConfidence)
        .filter(([_, status]) => status === 'practice')
        .map(([skill]) => skill);

    // Results Mode
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{result.role || 'Job Analysis Results'}</h1>
                    <p className="text-slate-500">{result.company || 'Preparation Plan'}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                        const text = result.plan.map(d => `Day ${d.day}: ${d.title}\n${d.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n');
                        copyToClipboard(text, "Plan");
                    }}>
                        <Copy className="w-4 h-4 mr-2" /> Copy Plan
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadTxt}>
                        <Download className="w-4 h-4 mr-2" /> Download TXT
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Score Card */}
                <Card className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-slate-900 border-none text-white relative overflow-hidden">
                    <div className="z-10 flex flex-col items-center">
                        <ReadinessCircle score={Math.round(liveScore)} />
                        <div className="text-center mt-2">
                            <p className="text-sm font-medium text-slate-400">Live Readiness Score</p>
                            <p className="text-xs text-slate-500 mt-1">Adjusts as you mark skills</p>
                        </div>
                    </div>
                </Card>

                {/* Skills Analysis */}
                <Card className="w-full md:w-2/3">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                            <span>Detected Skills</span>
                            <span className="text-xs font-normal text-slate-500">Click to toggle status</span>
                        </h3>
                        <div className="space-y-6">
                            {Object.entries(result.extractedSkills).map(([category, skills]) => (
                                <div key={category}>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(skill => {
                                            const status = skillConfidence[skill] || 'practice';
                                            return (
                                                <button
                                                    key={skill}
                                                    onClick={() => toggleSkill(skill)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-sm font-medium rounded-full border transition-all flex items-center gap-2",
                                                        status === 'know'
                                                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                                    )}
                                                >
                                                    {status === 'know' && <CheckCircle2 className="w-3 h-3" />}
                                                    {status === 'practice' && <AlertCircle className="w-3 h-3" />}
                                                    {skill}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Preparation Tabs */}
            <div className="space-y-4">
                <div className="flex border-b border-slate-200">
                    {['plan', 'checklist', 'questions'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {activeTab === 'plan' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.plan.map((day) => (
                            <Card key={day.day} className="border-l-4 border-l-primary/50">
                                <CardContent className="p-4">
                                    <div className="text-xs font-bold text-primary uppercase mb-1">Day {day.day}</div>
                                    <h4 className="font-bold text-slate-900 mb-3">{day.title}</h4>
                                    <ul className="space-y-2">
                                        {day.tasks.map((task, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                {task}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === 'checklist' && (
                    <div className="space-y-6">
                        {/* Company Intel Card */}
                        {result.companyIntel && (
                            <Card className={`border-l-4 ${result.companyIntel.color === 'blue' ? 'border-l-blue-500 bg-blue-50/50' : 'border-l-purple-500 bg-purple-50/50'}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building className={`w-5 h-5 ${result.companyIntel.color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`} />
                                        <span className={`text-xs font-bold uppercase tracking-wider ${result.companyIntel.color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`}>
                                            {result.companyIntel.type}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Hiring Focus</h3>
                                    <p className="text-slate-700 text-sm mb-3">{result.companyIntel.focus}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>Est. Size: {result.companyIntel.size}</span>
                                        <span>•</span>
                                        <span className="italic">Demo Mode: Heuristic Analysis</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid gap-6">
                            {result.rounds ? (
                                // New Timeline View
                                <div className="space-y-0">
                                    {result.rounds.map((round, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 z-10">
                                                    {i + 1}
                                                </div>
                                                {i < result.rounds.length - 1 && (
                                                    <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                                                )}
                                            </div>
                                            <div className="pb-8 flex-1">
                                                <Card>
                                                    <CardContent className="p-5">
                                                        <h4 className="font-bold text-slate-900 text-lg mb-1">{round.name}</h4>
                                                        <p className="text-slate-600 mb-3">{round.description}</p>
                                                        <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Why this round matters</p>
                                                            <p className="text-sm text-slate-700 italic">"{round.whyMatters}"</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Fallback to old grid if no rounds data (legacy history)
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(result.checklist).map(([round, items]) => (
                                        <Card key={round}>
                                            <CardContent className="p-6">
                                                <h4 className="font-bold text-slate-900 mb-4">{round}</h4>
                                                <ul className="space-y-3">
                                                    {items.map((item, i) => (
                                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center mt-4">
                            <Button variant="outline" onClick={() => {
                                let text = "";
                                if (result.rounds) {
                                    text = result.rounds.map(r => `${r.name}\n${r.description}\nWhy: ${r.whyMatters}`).join('\n\n');
                                } else {
                                    text = Object.entries(result.checklist).map(([round, items]) => `${round}:\n${items.map(i => `- ${i}`).join('\n')}`).join('\n\n');
                                }
                                copyToClipboard(text, "Checklist");
                            }}>
                                <Copy className="w-4 h-4 mr-2" /> Copy Full Checklist
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === 'questions' && (
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                    Likely Interview Questions
                                </h3>
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.questions.join('\n'), "Questions")}>
                                    <Copy className="w-4 h-4 mr-2" /> Copy
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {result.questions.map((q, i) => (
                                    <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-slate-800 font-medium">{i + 1}. {q}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Action Next Box */}
            <Card className="bg-primary text-white border-primary border-none">
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Ready to start?</h3>
                        <p className="text-primary-foreground/80 mb-4">
                            You have <span className="font-bold text-white">{weakSkills.length} skills</span> marked for practice.
                            {weakSkills.length > 0 && ` Focus on: ${weakSkills.slice(0, 3).join(', ')}...`}
                        </p>
                    </div>
                    <Button variant="secondary" className="whitespace-nowrap group">
                        Start Day 1 Plan <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </CardContent>
            </Card>

            <div className="mt-8 flex justify-center">
                <Button variant="ghost" onClick={() => setResult(null)}>
                    Analyze Another Job
                </Button>
            </div>
        </div>
    );
};

export default JobAnalysis;
