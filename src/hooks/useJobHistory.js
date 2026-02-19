import { useState, useEffect } from 'react';

const STORAGE_KEY = 'placement_prep_job_history';

export const useJobHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Filter out corrupted entries
                const valid = Array.isArray(parsed) ? parsed.filter(item => item && item.id && item.createdAt) : [];
                setHistory(valid);
            } catch (e) {
                console.error("Failed to parse history", e);
                // If corrupted, should we clear? Or just start empty?
                // Let's start empty but NOT clear to avoid auto-wiping user data without permission if it's potentially salvagable by advanced means.
                // But for app stability, we treat as empty.
                setHistory([]);
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
