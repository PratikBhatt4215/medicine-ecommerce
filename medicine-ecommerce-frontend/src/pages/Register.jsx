import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Auth.css';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert(t('msgRegSuccess'));
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || t('errRegFailed'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t('lblCreateAccount')}</h2>
        <p className="auth-subtitle">{t('lblJoinSubtitle')}</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('lblUsername')}</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
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
              minLength="6"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">{t('btnRegisterAction')}</button>
        </form>
        <p className="auth-link">
          {t('lblHasAccount')} <Link to="/login">{t('lblLogin')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
