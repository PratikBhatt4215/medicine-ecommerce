import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

import SelectTimezoneModal from './SelectTimezoneModal';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);
  const [showLangSubmenu, setShowLangSubmenu] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowLangSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (lng) => {
    console.log('Switching language to:', lng);
    i18n.changeLanguage(lng);
    // Optional: Close dropdown after selection if desired, or keep open to see change
    // setShowDropdown(false); 
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-content">
          <Link to="/" className="logo">
            <span className="logo-icon">💊</span>
            <span className="logo-text">MedStore</span>
          </Link>

          <div className="nav-links">
            <Link to="/" className="nav-link">{t('lblHome')}</Link>
            <Link to="/medicines" className="nav-link">{t('lblMedicines')}</Link>
            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="nav-link">{t('lblWishlist')}</Link>
                <Link to="/orders" className="nav-link">{t('lblOrders')}</Link>
              </>
            )}
          </div>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder={t('lblSearchPlaceholder')}
              className="search-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/medicines?search=${e.target.value}`);
                }
              }}
            />
          </div>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="cart-icon">
                  🛒
                  <span style={{ fontSize: '12px', marginLeft: '5px' }}>{t('lblCart')}</span>
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
                <div className="user-menu" ref={dropdownRef}>
                  <div
                    className="user-avatar"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {getInitials(user?.username)}
                  </div>
                  {showDropdown && (
                    <div className="dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-user-name">{user?.username}</div>
                        <div className="dropdown-user-email">{user?.email}</div>
                      </div>

                      <div className="dropdown-section">
                        <div className="dropdown-section-title">{t('lblLanguage')}</div>
                        <div className="lang-switch-container">
                          <button
                            className={`lang-btn ${i18n.resolvedLanguage === 'en' ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); changeLanguage('en'); }}
                          >
                            🇺🇸 English
                          </button>
                          <button
                            className={`lang-btn ${i18n.resolvedLanguage === 'fr' ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); changeLanguage('fr'); }}
                          >
                            🇫🇷 Français
                          </button>
                        </div>
                      </div>

                      <div className="dropdown-section">
                        <div className="dropdown-section-title">Timezone</div>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setShowDropdown(false);
                            setShowTimezoneModal(true);
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>🕒</span>
                          <span>{t('lblChangeTimezone')}</span>
                        </button>
                      </div>

                      {/* Warning Message */}
                      <div className="warning-text">
                        <span>⚠️</span>
                        <span>{t('msgPageReloadWarning') || 'Page reloads on change'}</span>
                      </div>

                      <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0' }}></div>

                      <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                        <span>👤</span> {t('lblProfile')}
                      </Link>

                      {isAdmin() && (
                        <>
                          <Link to="/admin" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                            <span>🛡️</span> {t('lblAdminPanel')}
                          </Link>
                          <Link to="/admin/logs" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                            <span>📋</span> {t('lblSystemLogs')}
                          </Link>
                        </>
                      )}

                      <button onClick={handleLogout} className="dropdown-item" style={{ color: 'var(--danger)' }}>
                        <span>🚪</span> {t('lblSignOut')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">{t('lblLogin')}</Link>
                <Link to="/register" className="btn btn-primary">{t('lblRegister')}</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {showTimezoneModal && <SelectTimezoneModal onClose={() => setShowTimezoneModal(false)} />}
    </>
  );
};

export default Navbar;
