import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Medicines from './pages/Medicines';
import MedicineDetail from './pages/MedicineDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageMedicines from './pages/admin/ManageMedicines';
import ManageOrders from './pages/admin/ManageOrders';
import SystemLogs from './pages/admin/SystemLogs';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  return isAuthenticated && isAdmin() ? children : <Navigate to="/" />;
};

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/medicines/:id" element={<MedicineDetail />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
        <Route path="/admin/medicines" element={<AdminRoute><ManageMedicines /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
        <Route path="/admin/logs" element={<AdminRoute><SystemLogs /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

import Footer from './components/Footer';
import HelpButton from './components/HelpButton';
import LiveClock from './components/LiveClock';
import { TimezoneProvider } from './context/TimezoneContext';

function App() {
  return (
    <AuthProvider>
      <TimezoneProvider>
        <ToastProvider>
          <CartProvider>
            <AppContent />
            <Footer />
            <HelpButton />
            <LiveClock />
          </CartProvider>
        </ToastProvider>
      </TimezoneProvider>
    </AuthProvider>
  );
}

export default App;
