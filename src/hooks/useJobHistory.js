import { useState, useEffect } from 'react';

const STORAGE_KEY = 'placement_prep_job_history';

export const useJobHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const saveEntry = (entry) => {
        const updated = [entry, ...history];
        setHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const updateEntry = (updatedEntry) => {
        const updated = history.map(item =>
            item.id === updatedEntry.id ? updatedEntry : item
        );
        setHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const getEntry = (id) => {
        return history.find(item => item.id === id);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    }

    return { history, saveEntry, updateEntry, getEntry, clearHistory };
};
