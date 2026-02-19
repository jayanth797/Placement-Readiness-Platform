import React from 'react';

const ReadinessCircle = ({ score = 72 }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-48 h-48">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-slate-100"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="96"
                        cy="96"
                    />
                    {/* Progress Circle */}
                    <circle
                        className="text-primary transition-all duration-1000 ease-out"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="96"
                        cy="96"
                    />
                </svg>
                {/* Center Text */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900">{score}</span>
                    <span className="text-sm text-slate-500 uppercase tracking-wider font-medium mt-1">/ 100</span>
                </div>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-600">Overall Readiness Score</p>
        </div>
    );
};

export default ReadinessCircle;
