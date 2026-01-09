import React, { useState, useEffect, useRef } from 'react';
import { logService } from '../../services/logService';


const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const logsEndRef = useRef(null);


    useEffect(() => {
        loadLogs();
        const interval = setInterval(() => {
            if (autoRefresh) {
                loadLogs(true); // silent refresh
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [autoRefresh]);

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadLogs = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const data = await logService.getSystemLogs();
            setLogs(data);
        } catch (error) {
            if (!silent) console.error('Error loading logs:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const getLogStyle = (line) => {
        if (line.includes('ERROR')) return { borderLeft: '4px solid #dc3545', background: '#fff5f5' };
        if (line.includes('WARN')) return { borderLeft: '4px solid #ffc107', background: '#fffbf2' };
        if (line.includes('INFO')) return { borderLeft: '4px solid #0d6efd', background: '#f8f9fa' };
        return { borderLeft: '4px solid #adb5bd', background: '#ffffff' };
    };

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ marginBottom: '10px' }}>System Logs</h1>
                    <p style={{ color: 'var(--gray)' }}>Application activity monitoring</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                            style={{ width: '16px', height: '16px' }}
                        />
                        <span>Auto-refresh</span>
                    </label>
                    <button onClick={() => loadLogs()} className="btn btn-primary">
                        Refresh Logs
                    </button>
                </div>
            </div>

            <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                height: '600px',
                overflowY: 'auto',
                border: '1px solid #e9ecef',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                {loading && !logs.length ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : (
                    logs.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {logs.map((log, index) => (
                                <div key={index} style={{
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    padding: '12px 16px',
                                    borderRadius: '6px',
                                    color: '#212529',
                                    ...getLogStyle(log)
                                }}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#6c757d' }}>
                            <p style={{ fontSize: '1.1rem' }}>No system logs available.</p>
                            <p style={{ fontSize: '0.9rem' }}>Check server configuration or wait for activity.</p>
                        </div>
                    )
                )}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};

export default SystemLogs;
