import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Rocket, CheckCircle2, ArrowLeft, Lock } from 'lucide-react';

const STORAGE_KEY = 'prp_test_checklist';
const REQUIRED_COUNT = 10;

const ShipPage = () => {
    const navigate = useNavigate();
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const checkedItems = JSON.parse(stored);
            const passedCount = Object.values(checkedItems).filter(Boolean).length;
            if (passedCount >= REQUIRED_COUNT) {
                setIsAllowed(true);
            }
        }
    }, []);

    if (!isAllowed) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <Card className="max-w-md w-full text-center border-red-200 bg-red-50/50">
                    <CardContent className="p-8 space-y-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
                        <p className="text-slate-600">
                            You must complete all 10 verification tests before accessing the shipping page.
                        </p>
                        <Button onClick={() => navigate('/prp/07-test')} className="w-full mt-4">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Checklist
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/10 backdrop-blur-md text-white relative z-10">
                <CardContent className="p-12 text-center space-y-8">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/30 animate-pulse">
                        <Rocket className="w-12 h-12 text-green-400" />
                    </div>

                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-500">
                            Ready to Ship!
                        </h1>
                        <p className="text-xl text-slate-300">
                            Placement Readiness Platform is hardened, tested, and verified.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h3 className="font-bold text-green-400 mb-1 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> 100%
                            </h3>
                            <p className="text-xs text-slate-400">Tests Passed</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h3 className="font-bold text-blue-400 mb-1 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Hardened
                            </h3>
                            <p className="text-xs text-slate-400">Input Validation</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h3 className="font-bold text-purple-400 mb-1 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Clean
                            </h3>
                            <p className="text-xs text-slate-400">Premium UI</p>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col items-center gap-4">
                        <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">
                            Deployment Status: GREEN
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ShipPage;
