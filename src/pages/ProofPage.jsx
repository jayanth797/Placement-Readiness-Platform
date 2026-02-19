import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CheckCircle2, Circle, Copy, ExternalLink, Trophy, AlertCircle, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';

const STORAGE_KEY = 'prp_final_submission';
const CHECKLIST_KEY = 'prp_test_checklist';

const STEPS = [
    { id: 'setup', label: 'Project Setup & Design System' },
    { id: 'ui', label: 'Dashboard UI Implementation' },
    { id: 'logic', label: 'Job Analysis Logic (Heuristics)' },
    { id: 'intel', label: 'Company Intel & Round Engine' },
    { id: 'hardening', label: 'Input Validation & Hardening' },
    { id: 'persistence', label: 'History & LocalStorage' },
    { id: 'testing', label: 'Verification Checklist (10/10)' },
    { id: 'shipping', label: 'Ship Lock Mechanism' }
];

const ProofPage = () => {
    const [links, setLinks] = useState({ lovable: '', github: '', deployed: '' });
    const [stepStatus, setStepStatus] = useState({});
    const [checklistPassed, setChecklistPassed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load State
    useEffect(() => {
        // Load Submission Data
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            setLinks(parsed.links || { lovable: '', github: '', deployed: '' });
            setStepStatus(parsed.stepStatus || {});
        }

        // Check Verification Checklist
        const checklist = localStorage.getItem(CHECKLIST_KEY);
        if (checklist) {
            const parsedCheck = JSON.parse(checklist);
            const passedCount = Object.values(parsedCheck).filter(Boolean).length;
            setChecklistPassed(passedCount >= 10);

            // Auto-mark testing step if passed
            if (passedCount >= 10) {
                setStepStatus(prev => ({ ...prev, testing: true }));
            }
        }

        setIsLoaded(true);
    }, []);

    // Save State
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ links, stepStatus }));
        }
    }, [links, stepStatus, isLoaded]);

    const handleLinkChange = (key, value) => {
        setLinks(prev => ({ ...prev, [key]: value }));
    };

    const toggleStep = (id) => {
        // Prevent manual toggle of 'testing' step, it's auto-derived
        if (id === 'testing') return;
        setStepStatus(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const linksValid = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployed);
    const allStepsComplete = STEPS.every(s => stepStatus[s.id]);

    // Shipped Condition: All Steps + Checklist Passed + All Links Valid
    const isShipped = allStepsComplete && checklistPassed && linksValid;

    const copyFinalSubmission = () => {
        const text = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
        `.trim();

        navigator.clipboard.writeText(text);
        alert("Final submission copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Final Proof & Submission</h1>
                        <p className="text-slate-500">Verify completion and generate your submission artifact.</p>
                    </div>
                    <div className={cn(
                        "px-4 py-2 rounded-full font-bold text-sm tracking-wide uppercase flex items-center gap-2",
                        isShipped ? "bg-green-100 text-green-700 border border-green-200" : "bg-slate-200 text-slate-600 border border-slate-300"
                    )}>
                        {isShipped ? <Rocket className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        Status: {isShipped ? "SHIPPED" : "IN PROGRESS"}
                    </div>
                </div>

                {isShipped && (
                    <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
                        <CardContent className="p-8 relative z-10 text-center space-y-4">
                            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-2 animate-bounce" />
                            <h2 className="text-2xl font-bold">You built a real product.</h2>
                            <p className="text-slate-300 max-w-lg mx-auto text-lg">
                                Not a tutorial. Not a clone.<br />
                                A structured tool that solves a real problem.<br /><br />
                                This is your proof of work.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Step A: Development Steps */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 border-b pb-2">A. Development Steps</h3>
                        <Card>
                            <CardContent className="p-0 divide-y divide-slate-100">
                                {STEPS.map((step) => (
                                    <div
                                        key={step.id}
                                        className={cn(
                                            "p-4 flex items-center gap-3 transition-colors",
                                            step.id !== 'testing' && "cursor-pointer hover:bg-slate-50"
                                        )}
                                        onClick={() => toggleStep(step.id)}
                                    >
                                        <div className={cn("transition-colors", stepStatus[step.id] ? "text-green-500" : "text-slate-300")}>
                                            {stepStatus[step.id] ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                        </div>
                                        <span className={cn("font-medium", stepStatus[step.id] ? "text-slate-900" : "text-slate-500")}>
                                            {step.label}
                                        </span>
                                        {step.id === 'testing' && !checklistPassed && (
                                            <span className="ml-auto text-xs text-amber-600 font-medium">Incomplete</span>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Step B: Artifacts */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 border-b pb-2">B. Submission Artifacts</h3>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Lovable Project Link *</label>
                                    <input
                                        type="url"
                                        placeholder="https://lovable.dev/..."
                                        className={cn("w-full p-2 border rounded-md outline-none focus:ring-2",
                                            links.lovable && !isValidUrl(links.lovable) ? "border-red-300 ring-red-200" : "border-slate-200 focus:ring-primary/20"
                                        )}
                                        value={links.lovable}
                                        onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">GitHub Repository Link *</label>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/..."
                                        className={cn("w-full p-2 border rounded-md outline-none focus:ring-2",
                                            links.github && !isValidUrl(links.github) ? "border-red-300 ring-red-200" : "border-slate-200 focus:ring-primary/20"
                                        )}
                                        value={links.github}
                                        onChange={(e) => handleLinkChange('github', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Deployed URL *</label>
                                    <input
                                        type="url"
                                        placeholder="https://vercel.app/..."
                                        className={cn("w-full p-2 border rounded-md outline-none focus:ring-2",
                                            links.deployed && !isValidUrl(links.deployed) ? "border-red-300 ring-red-200" : "border-slate-200 focus:ring-primary/20"
                                        )}
                                        value={links.deployed}
                                        onChange={(e) => handleLinkChange('deployed', e.target.value)}
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button
                                        className="w-full"
                                        disabled={!isShipped}
                                        onClick={copyFinalSubmission}
                                    >
                                        <Copy className="w-4 h-4 mr-2" /> Copy Final Submission
                                    </Button>
                                    {!isShipped && (
                                        <p className="text-xs text-center text-slate-400 mt-2">
                                            Complete all steps and fields to unlock.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProofPage;
