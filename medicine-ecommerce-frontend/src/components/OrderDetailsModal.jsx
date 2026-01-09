import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTimezone } from '../context/TimezoneContext';
import { formatCurrency } from '../utils/formatters';
import ImageWithFallback from './ImageWithFallback';

const OrderDetailsModal = ({ order, onClose }) => {
    const { t } = useTranslation();
    const { formatDate } = useTimezone();

    if (!order) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                background: 'white', padding: '30px', borderRadius: '12px',
                maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto',
                position: 'relative'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '15px',
                    background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'
                }}>&times;</button>

                <h2 style={{ marginBottom: '20px' }}>{t('lblOrderNumber')} {order.id}</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div>
                        <h4 style={{ color: 'var(--gray)', marginBottom: '5px' }}>{t('lblDate')}</h4>
                        <p>{formatDate(order.orderDate)}</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--gray)', marginBottom: '5px' }}>{t('lblStatus')}</h4>
                        <span style={{
                            padding: '4px 12px',
                            background: order.status === 'DELIVERED' ? 'var(--success)' : 'var(--primary)',
                            color: 'white', borderRadius: '20px', fontSize: '14px'
                        }}>{order.status}</span>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <h4 style={{ color: 'var(--gray)', marginBottom: '5px' }}>{t('lblShippingAddress')}</h4>
                        <p style={{ background: 'var(--light)', padding: '10px', borderRadius: '8px' }}>
                            {order.shippingAddress}
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--gray)', marginBottom: '5px' }}>{t('lblCustomerDetails')}</h4>
                        <p><strong>{t('lblName')}:</strong> {order.user?.username}</p>
                        <p><strong>{t('lblEmail')}:</strong> {order.user?.email}</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--gray)', marginBottom: '5px' }}>{t('lblPaymentMethod')}</h4>
                        <p>{order.paymentId ? 'Online Payment (Card)' : t('lblCOD')}</p>
                    </div>
                </div>

                <h3 style={{ marginBottom: '15px' }}>{t('lblOrderItems')}</h3>
                <div style={{ marginBottom: '20px' }}>
                    {order.orderItems?.map(item => (
                        <div key={item.id} style={{
                            display: 'flex', alignItems: 'center', gap: '15px',
                            padding: '10px 0', borderBottom: '1px solid var(--border)'
                        }}>
                            <div style={{ width: '60px', height: '60px', background: 'var(--light)', borderRadius: '8px', overflow: 'hidden' }}>
                                <ImageWithFallback
                                    imageUrl={item.medicine?.imageUrl}
                                    alt={item.medicine?.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '600' }}>{item.medicine?.name}</p>
                                <p style={{ fontSize: '14px', color: 'var(--gray)' }}>{t('lblQty')}: {item.quantity}</p>
                            </div>
                            <p style={{ fontWeight: '600' }}>{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                    ))}
                </div>

                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: '20px', borderTop: '2px solid var(--border)', fontSize: '20px', fontWeight: 'bold'
                }}>
                    <span>{t('lblTotal')}</span>
                    <span style={{ color: 'var(--primary)' }}>{formatCurrency(order.totalAmount)}</span>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                    <button className="btn btn-outline" onClick={onClose}>{t('btnClose')}</button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
