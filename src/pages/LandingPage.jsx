import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Video, BarChart3 } from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/ui/FeatureCard';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        Ace Your Placement
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        Practice, assess, and prepare for your dream job with our comprehensive placement readiness platform.
                    </p>
                    <Button onClick={() => navigate('/dashboard')}>
                        Get Started
                    </Button>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Code}
                            title="Practice Problems"
                            description="Solve curated coding challenges to sharpen your logic."
                        />
                        <FeatureCard
                            icon={Video}
                            title="Mock Interviews"
                            description="Simulate real interview scenarios with AI feedback."
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Track Progress"
                            description="Monitor your growth and readiness over time."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-8 text-center">
                <p>&copy; 2024 Placement Prep. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
