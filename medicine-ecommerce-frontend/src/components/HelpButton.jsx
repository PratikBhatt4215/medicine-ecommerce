import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useTimezone } from '../context/TimezoneContext';

const HelpButton = () => {
    const { t } = useTranslation();
    const { formatDate } = useTimezone();
    const [showModal, setShowModal] = useState(false);
    const [systemInfo, setSystemInfo] = useState({
        startTime: t('lblLoading'),
        developer: 'Pratik Bhatt',
        contact: 'pratik.bhatt@gmail.com'
    });

    const fetchSystemInfo = async () => {
        try {
            const response = await api.get('/public/system-info');
            if (response && response.data && response.data.data) {
                setSystemInfo(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch system info', error);
            setSystemInfo(prev => ({ ...prev, startTime: t('lblUnavailable') }));
        }
    };

    useEffect(() => {
        if (showModal) {
            fetchSystemInfo();
        }
    }, [showModal]);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                style={{
                    position: 'fixed',
                    bottom: '50px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    zIndex: 9998,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title={t('lblSystemInfo')}
            >
                ?
            </button>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '400px',
                        maxWidth: '90%',
                        position: 'relative',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>
                        <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{t('lblSystemInformationTitle')}</h3>

                        <div style={{ margin: '20px 0' }}>
                            <p><strong>{t('lblDevelopedBy')}</strong> {systemInfo.developer}</p>
                            <p><strong>{t('lblContact')}</strong> <a href={`mailto:${systemInfo.contact}`}>{systemInfo.contact}</a></p>
                            <div style={{
                                marginTop: '15px',
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}>
                                <small style={{ display: 'block', color: '#666', marginBottom: '5px' }}>{t('lblServerStartedAt')}</small>
                                <code style={{ color: '#d63384' }}>{formatDate(systemInfo.startTime)}</code>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {t('btnClose')}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HelpButton;
