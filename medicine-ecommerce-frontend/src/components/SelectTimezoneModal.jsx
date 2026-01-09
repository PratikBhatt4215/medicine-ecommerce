import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useTimezone } from '../context/TimezoneContext';

const SelectTimezoneModal = ({ onClose }) => {
    const { t } = useTranslation();
    const { selectedZone, changeTimezone } = useTimezone();
    const [timezones, setTimezones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSelection, setCurrentSelection] = useState(selectedZone);
    const [searchTerm, setSearchTerm] = useState('');
    const [processedTimezones, setProcessedTimezones] = useState([]);

    useEffect(() => {
        fetchTimezones();
    }, []);

    const fetchTimezones = async () => {
        try {
            const response = await api.get('/public/timezones');
            if (response.data.success) {
                setTimezones(response.data.data);
            }
        } catch (error) {
            console.error('Failed to load timezones', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Filter and Sort Logic
        let filtered = [...timezones];

        // 1. Search Filter
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(tz =>
                tz.label.toLowerCase().includes(lowerTerm) ||
                tz.abbr.toLowerCase().includes(lowerTerm) ||
                tz.zoneId.toLowerCase().includes(lowerTerm)
            );
        }

        // 2. Alphabetical Sort
        filtered.sort((a, b) => a.label.localeCompare(b.label));

        // 3. Priority Sorting (if no search term active)
        if (!searchTerm) {
            const defaultZoneId = 'Asia/Kolkata';
            const defaultZone = filtered.find(tz => tz.zoneId === defaultZoneId);
            const currentZone = filtered.find(tz => tz.zoneId === currentSelection);

            // Remove them from current positions
            filtered = filtered.filter(tz => tz.zoneId !== defaultZoneId && tz.zoneId !== currentSelection);

            // Re-insert at top
            // Index 1: Default Zone (if different from current)
            if (defaultZone && defaultZoneId !== currentSelection) {
                filtered.unshift({ ...defaultZone, isDefault: true });
            }

            // Index 0: Current Selection
            if (currentZone) {
                filtered.unshift(currentZone);
            }
        }

        setProcessedTimezones(filtered);
    }, [timezones, searchTerm, currentSelection]);

    const handleApply = () => {
        changeTimezone(currentSelection);
        // Page will reload via Context
    };

    return (
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
            zIndex: 10000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '500px',
                maxWidth: '90%',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ margin: 0 }}>{t('lblSelectTimezone')}</h3>
                </div>

                <div style={{ padding: '20px' }}>
                    {loading ? (
                        <div className="text-center">{t('lblLoading')}</div>
                    ) : (
                        <div>
                            <input
                                type="text"
                                placeholder={t('phSearchTimezone')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '15px',
                                    borderRadius: '4px',
                                    border: '1px solid #ced4da',
                                    fontSize: '14px'
                                }}
                            />

                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>{t('lblChooseTimezone')}</label>
                            <select
                                value={currentSelection}
                                onChange={(e) => setCurrentSelection(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    border: '1px solid #ced4da',
                                    fontSize: '16px',
                                    backgroundColor: 'white'
                                }}
                            >
                                {processedTimezones.map((tz) => (
                                    <option key={tz.zoneId} value={tz.zoneId}>
                                        {tz.isDefault ? "⭐ " : ""}{tz.label} ({tz.abbr}) - {tz.offset}
                                    </option>
                                ))}
                            </select>
                            {processedTimezones.length === 0 && (
                                <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                                    {t('msgNoTimezonesFound')} "{searchTerm}"
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                        onClick={onClose}
                        className="btn btn-outline"
                    >
                        {t('btnCancel')}
                    </button>
                    <button
                        onClick={handleApply}
                        className="btn btn-primary"
                        disabled={loading || currentSelection === selectedZone}
                    >
                        {t('btnApplyRefresh')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectTimezoneModal;
