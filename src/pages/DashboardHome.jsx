import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import ReadinessCircle from './dashboard/ReadinessCircle';
import SkillRadar from './dashboard/SkillRadar';
import WeeklyGoals from './dashboard/WeeklyGoals';
import AssessmentList from './dashboard/AssessmentList';
import ContinuePractice from './dashboard/ContinuePractice';

const DashboardHome = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, John! 👋</h1>
                <span className="text-sm text-slate-500">Last login: Today, 9:20 AM</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Overall Readiness */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Overall Readiness</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ReadinessCircle score={72} />
                        </CardContent>
                    </Card>

                    {/* Weekly Goals */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Goals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <WeeklyGoals />
                        </CardContent>
                    </Card>

                    {/* Continue Practice */}
                    <Card className="bg-slate-900 text-white border-slate-800">
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Last Topic</p>
                                        <h3 className="text-lg font-bold text-white">Dynamic Programming</h3>
                                    </div>
                                    <span className="text-sm font-medium text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">3/10</span>
                                </div>

                                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
                                    <div className="h-full w-full flex-1 bg-indigo-500 transition-all" style={{ transform: 'translateX(-70%)' }} />
                                </div>

                                <button className="w-full mt-2 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors">
                                    Continue
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Skill Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SkillRadar />
                        </CardContent>
                    </Card>

                    {/* Upcoming Assessments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Assessments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AssessmentList />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
