import React from 'react';
import { Progress } from '../../components/ui/Progress';
import Button from '../../components/ui/Button';

const ContinuePractice = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Last Topic</p>
                    <h3 className="text-lg font-bold text-slate-900">Dynamic Programming</h3>
                </div>
                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">3/10</span>
            </div>

            <Progress value={30} className="h-2" />

            <Button className="w-full mt-2 py-2 text-sm">
                Continue
            </Button>
        </div>
    );
};

export default ContinuePractice;
