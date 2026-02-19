import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CheckCircle2, AlertTriangle, Lock, Unlock, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const CHECKLIST_ITEMS = [
    { id: 1, label: "JD required validation works", hint: "Try analyzing with empty JD. Button should be disabled." },
    { id: 2, label: "Short JD warning shows for <200 chars", hint: "Paste a short text. Verify yellow warning message." },
    { id: 3, label: "Skills extraction groups correctly", hint: "Check if extracted skills appear in correct categories (Web, Data, etc)." },
    { id: 4, label: "Round mapping changes based on company + skills", hint: "Compare Enterprise vs Startup round names." },
    { id: 5, label: "Score calculation is deterministic", hint: "Same input should always produce the same base score." },
    { id: 6, label: "Skill toggles update score live", hint: "Toggle skills and watch the score change immediately." },
    { id: 7, label: "Changes persist after refresh", hint: "Reload page after toggling skills. Score/toggles should persist." },
    { id: 8, label: "History saves and loads correctly", hint: "Check 'History' tab for saved entries." },
    { id: 9, label: "Export buttons copy the correct content", hint: "Click 'Copy Plan' and paste to verify text." },
    { id: 10, label: "No console errors on core pages", hint: "Open DevTools > Console and navigate around." }
];

const STORAGE_KEY = 'prp_test_checklist';

const TestChecklist = () => {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setCheckedItems(JSON.parse(stored));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
        }
    }, [checkedItems, isLoaded]);

    const handleToggle = (id) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset the checklist?")) {
            setCheckedItems({});
        }
    };

    const passedCount = CHECKLIST_ITEMS.filter(item => checkedItems[item.id]).length;
    const isComplete = passedCount === CHECKLIST_ITEMS.length;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-slate-900">Pre-Shipment Test Checklist</h1>
                    <p className="text-slate-500">Complete all verification steps to unlock the final shipping page.</p>
                </div>

                {/* Status Card */}
                <Card className={cn("border-l-4", isComplete ? "border-l-green-500 bg-green-50/50" : "border-l-amber-500 bg-amber-50/50")}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {isComplete ? <CheckCircle2 className="text-green-600" /> : <AlertTriangle className="text-amber-600" />}
                                Tests Passed: {passedCount} / {CHECKLIST_ITEMS.length}
                            </h2>
                            {!isComplete && <p className="text-slate-600 mt-1">Fix issues before shipping.</p>}
                            {isComplete && <p className="text-green-700 mt-1 font-medium">All systems go! Ready to ship.</p>}
                        </div>
                        <Button variant="outline" size="sm" onClick={handleReset} className="text-slate-500 hover:text-red-600 hover:bg-red-50 border-slate-200">
                            <RotateCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                    </CardContent>
                </Card>

                {/* Checklist */}
                <Card>
                    <CardContent className="p-0 divide-y divide-slate-100">
                        {CHECKLIST_ITEMS.map((item) => (
                            <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                                <div className="pt-1">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                        checked={!!checkedItems[item.id]}
                                        onChange={() => handleToggle(item.id)}
                                    />
                                </div>
                                <div className="flex-1 cursor-pointer" onClick={() => handleToggle(item.id)}>
                                    <h3 className={cn("font-medium text-slate-900", checkedItems[item.id] && "text-slate-500 line-through decoration-slate-300")}>
                                        {item.label}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-0.5">{item.hint}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Footer Action */}
                <div className="flex justify-center pt-4">
                    <Button
                        size="lg"
                        disabled={!isComplete}
                        className={cn("w-full md:w-auto px-12 transition-all", isComplete ? "shadow-lg shadow-green-200" : "opacity-50")}
                        onClick={() => navigate('/prp/08-ship')}
                    >
                        {isComplete ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                        {isComplete ? "Proceed to Ship" : "Locked: Complete All Tests"}
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default TestChecklist;
