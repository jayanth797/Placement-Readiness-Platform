import React from 'react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
            <div className="p-12 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-500">
                Content for {title} coming soon...
            </div>
        </div>
    );
};

export default PlaceholderPage;
