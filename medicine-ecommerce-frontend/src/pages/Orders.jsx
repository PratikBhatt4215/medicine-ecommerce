import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { orderService } from '../services/orderService';
import { useTimezone } from '../context/TimezoneContext';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { formatCurrency } from '../utils/formatters';
import ImageWithFallback from '../components/ImageWithFallback';

const Orders = () => {
  const { t } = useTranslation();
  const { formatDate } = useTimezone();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      console.log('Fetching orders...');
      const data = await orderService.getUserOrders();
      console.log('Orders fetched:', data);

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Orders data is not an array:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>{t('lblMyOrders')}</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p>{t('msgNoOrders')}</p>
        </div>
      ) : (
        <div style={{ marginTop: '30px' }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div>
                  <h3>{t('lblOrderNumber')}{order.id}</h3>
                  <p style={{ color: 'var(--gray)', fontSize: '14px' }}>
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>{formatCurrency(order.totalAmount)}</p>
                  <span style={{ padding: '5px 15px', background: 'var(--success)', color: 'white', borderRadius: '20px', fontSize: '12px' }}>{order.status}</span>
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                {order.orderItems?.slice(0, 2).map(item => (
                  <div key={item.id} style={{ padding: '10px 0', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', background: 'var(--light)', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                      <ImageWithFallback
                        imageUrl={item.medicine?.imageUrl}
                        alt={item.medicine?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span>{item.medicine?.name} x {item.quantity}</span>
                    </div>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                {order.orderItems?.length > 2 && (
                  <p style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '5px' }}>+{order.orderItems.length - 2} more items...</p>
                )}
              </div>

              <button
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => setSelectedOrder(order)}
              >
                {t('btnViewDetails') || "View Details"}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;
