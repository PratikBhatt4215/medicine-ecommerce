import React, { useState, useEffect } from 'react';
import { useTimezone } from '../context/TimezoneContext';

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    const { formatDate } = useTimezone();

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100%',
            backgroundColor: '#f8f9fa',
            color: '#6c757d',
            padding: '4px 10px',
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            zIndex: 9997,
            borderTop: '1px solid #dee2e6',
            textAlign: 'center'
        }}>
            {formatDate(time)}
        </div>
    );
};

export default LiveClock;
