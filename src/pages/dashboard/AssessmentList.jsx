import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const assessments = [
    { id: 1, title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM', type: 'Technical' },
    { id: 2, title: 'System Design Review', time: 'Wed, 2:00 PM', type: 'Design' },
    { id: 3, title: 'HR Interview Prep', time: 'Friday, 11:00 AM', type: 'Behavioral' },
];

const AssessmentList = () => {
    return (
        <div className="space-y-4">
            {assessments.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-colors">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />
                                <span>{item.time}</span>
                            </div>
                        </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-white border border-slate-200 text-slate-600">
                        {item.type}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default AssessmentList;
