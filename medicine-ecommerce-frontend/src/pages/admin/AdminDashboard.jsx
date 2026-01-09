import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Admin Dashboard</h1>
      <div className="grid grid-3" style={{ marginTop: '30px' }}>
        <Link to="/admin/categories" className="card" style={{ textDecoration: 'none', color: 'white', textAlign: 'center', padding: '40px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', transition: 'transform 0.2s' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📁</div>
          <h3 style={{ color: 'white' }}>Manage Categories</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Add, edit, or delete categories</p>
        </Link>
        <Link to="/admin/medicines" className="card" style={{ textDecoration: 'none', color: 'white', textAlign: 'center', padding: '40px', background: 'linear-gradient(135deg, #10b981, #059669)', transition: 'transform 0.2s' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>💊</div>
          <h3 style={{ color: 'white' }}>Manage Medicines</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Add, edit, or delete medicines</p>
        </Link>
        <Link to="/admin/orders" className="card" style={{ textDecoration: 'none', color: 'white', textAlign: 'center', padding: '40px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', transition: 'transform 0.2s' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📦</div>
          <h3 style={{ color: 'white' }}>Manage Orders</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>View and update order status</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
