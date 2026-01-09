import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { format } from 'date-fns-tz';
import { enCA } from 'date-fns/locale';

const TimezoneContext = createContext(null);

export const TimezoneProvider = ({ children }) => {
    const { user } = useAuth();
    const [selectedZone, setSelectedZone] = useState('Asia/Kolkata');

    useEffect(() => {
        // If user has a saved preference, use it
        if (user && user.timezone) {
            setSelectedZone(user.timezone);
        } else {
            // Fallback to localStorage if not logged in, or default
            const saved = localStorage.getItem('timezone');
            if (saved) {
                setSelectedZone(saved);
            }
        }
    }, [user]);

    const changeTimezone = async (newZone) => {
        // Optimistic update
        setSelectedZone(newZone);
        localStorage.setItem('timezone', newZone);

        // If logged in, save to backend
        if (user) {
            try {
                await api.post('/user/timezone', { timezone: newZone });
            } catch (error) {
                console.error("Failed to save timezone preference", error);
            }
        }

        // Reload page to ensure all components pick up the new zone cleanly
        window.location.reload();
    };

    const formatDate = (dateString, formatStr = 'yyyy-MM-dd HH:mm:ss zzz') => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, formatStr, { timeZone: selectedZone, locale: enCA });
        } catch (e) {
            console.error("Date formatting error:", e);
            return dateString;
        }
    };

    return (
        <TimezoneContext.Provider value={{ selectedZone, changeTimezone, formatDate }}>
            {children}
        </TimezoneContext.Provider>
    );
};

export const useTimezone = () => {
    const context = useContext(TimezoneContext);
    if (!context) {
        throw new Error('useTimezone must be used within TimezoneProvider');
    }
    return context;
};
