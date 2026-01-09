import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Auth.css';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/');
    } catch {
      setError(t('errInvalidCredentials'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t('lblWelcomeBack')}</h2>
        <p className="auth-subtitle">{t('lblLoginSubtitle')}</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('lblEmail')}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('lblPassword')}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">{t('btnLoginAction')}</button>
        </form>
        <p className="auth-link">
          {t('lblNoAccount')} <Link to="/register">{t('lblRegister')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
