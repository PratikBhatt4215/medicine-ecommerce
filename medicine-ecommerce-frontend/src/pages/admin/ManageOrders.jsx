import React, { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../services/orderService';
import { useTimezone } from '../../context/TimezoneContext';

const ManageOrders = () => {
  const { formatDate } = useTimezone();
  const [orders, setOrders] = useState([]);

  const loadOrders = useCallback(async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      loadOrders();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Manage Orders</h1>
      <div style={{ marginTop: '30px' }}>
        {orders.map(order => (
          <div key={order.id} className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div>
                <h3>Order #{order.id}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Customer: {order.user?.username}</p>
                <p style={{ color: 'var(--gray)', fontSize: '14px' }}>{formatDate(order.orderDate)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>₹{order.totalAmount}</p>
                <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} style={{ marginTop: '10px' }}>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>
            </div>
            <div>
              {order.orderItems?.map(item => (
                <div key={item.id} style={{ padding: '10px 0', borderTop: '1px solid var(--border)' }}>
                  <span>{item.medicine?.name} x {item.quantity}</span>
                  <span style={{ float: 'right' }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageOrders;
