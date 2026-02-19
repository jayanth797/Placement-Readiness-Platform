import React from 'react';
import { Progress } from '../../components/ui/Progress';

const WeeklyGoals = () => {
    const days = [
        { day: 'M', active: true },
        { day: 'T', active: true },
        { day: 'W', active: true },
        { day: 'T', active: false },
        { day: 'F', active: false },
        { day: 'S', active: false },
        { day: 'S', active: false },
    ];

    return (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Problems Solved</span>
                    <span className="text-sm text-slate-500">12 / 20</span>
                </div>
                <Progress value={60} className="h-2.5" />
            </div>

            <div className="flex justify-between items-center pt-2">
                {days.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${item.active
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-100 text-slate-400'
                                }`}
                        >
                            {item.day}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyGoals;
