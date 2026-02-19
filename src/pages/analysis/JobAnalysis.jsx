import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { analyzeJD } from '../../lib/analyzer';
import { useJobHistory } from '../../hooks/useJobHistory';
import ReadinessCircle from '../dashboard/ReadinessCircle';
import { CheckCircle2, ChevronRight, BookOpen, HelpCircle } from 'lucide-react';

const JobAnalysis = () => {
    const [searchParams] = useSearchParams();
    const historyId = searchParams.get('id');
    const { saveEntry, getEntry } = useJobHistory();

    const [input, setInput] = useState({ company: '', role: '', text: '' });
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('plan'); // plan, checklist, questions

    useEffect(() => {
        if (historyId) {
            const entry = getEntry(historyId);
            if (entry) {
                setResult(entry);
                setInput({ company: entry.company, role: entry.role, text: entry.jdText });
            }
        }
    }, [historyId, getEntry]);

    const handleAnalyze = () => {
        if (!input.text.trim()) return;
        const analysis = analyzeJD(input.text, input.company, input.role);
        setResult(analysis);
        saveEntry(analysis);
    };

    if (!result) {
        // Input Mode
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
                                className="w-full h-64 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                placeholder="Paste the full job description here..."
                                value={input.text}
                                onChange={(e) => setInput({ ...input, text: e.target.value })}
                            />
                        </div>

                        <Button onClick={handleAnalyze} className="w-full md:w-auto" disabled={!input.text.trim()}>
                            Analyze Job Description
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Results Mode
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Score Card */}
                <Card className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-slate-900 border-none text-white">
                    <ReadinessCircle score={result.readinessScore} />
                    <div className="text-center mt-2">
                        <h2 className="text-xl font-bold">{result.role || 'Job Role'}</h2>
                        <p className="text-slate-400">{result.company || 'Target Company'}</p>
                    </div>
                </Card>

                {/* Skills Analysis */}
                <Card className="w-full md:w-2/3">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Detected Skills</h3>
                        <div className="space-y-4">
                            {Object.entries(result.extractedSkills).map(([category, skills]) => (
                                <div key={category}>
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                                {skill}
                                            </span>
                                        ))}
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

                {activeTab === 'questions' && (
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-primary" />
                                Likely Interview Questions
                            </h3>
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

            <div className="mt-8 flex justify-center">
                <Button variant="outline" onClick={() => setResult(null)}>
                    Analyze Another Job
                </Button>
            </div>
        </div>
    );
};

export default JobAnalysis;
