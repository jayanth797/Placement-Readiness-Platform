import React from 'react';

const FeatureCard = ({ icon: Icon, title, description }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600">{description}</p>
        </div>
    );
};

export default FeatureCard;
