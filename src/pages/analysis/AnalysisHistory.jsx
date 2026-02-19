import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobHistory } from '../../hooks/useJobHistory';
import { Card, CardContent } from '../../components/ui/Card';
import { Calendar, Briefcase, Building } from 'lucide-react';

const AnalysisHistory = () => {
    const { history } = useJobHistory();
    const navigate = useNavigate();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Analysis History</h1>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 mb-4">No analysis history found.</p>
                    <button
                        onClick={() => navigate('/dashboard/analyze')}
                        className="text-primary font-medium hover:underline"
                    >
                        Analyze a new Job Description
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {history.map((item) => (
                        <Card
                            key={item.id}
                            className="cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => navigate(`/dashboard/analyze?id=${item.id}`)}
                        >
                            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {item.role || 'Unknown Role'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Building className="w-4 h-4" />
                                        <span className="text-sm font-medium">{item.company || 'Unknown Company'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 uppercase font-medium">Readiness</span>
                                            <span className={`text-lg font-bold ${item.readinessScore >= 70 ? 'text-green-600' :
                                                    item.readinessScore >= 40 ? 'text-amber-600' : 'text-red-600'
                                                }`}>
                                                {item.readinessScore}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnalysisHistory;
