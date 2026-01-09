import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTimezone } from '../context/TimezoneContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user } = useAuth();
  const { formatDate } = useTimezone();
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>{t('lblProfile')}</h1>
      <div className="card" style={{ maxWidth: '600px', margin: '30px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '700', margin: '0 auto 20px' }}>
            {user?.username?.substring(0, 2).toUpperCase()}
          </div>
          <h2>{user?.username}</h2>
          <p style={{ color: 'var(--gray)' }}>{user?.email}</p>
        </div>
        <div style={{ padding: '20px', background: 'var(--light)', borderRadius: '8px' }}>
          <div style={{ marginBottom: '15px' }}>
            <strong>{t('lblRole')}:</strong> {user?.role}
          </div>
          <div>
            <strong>{t('lblMemberSince')}:</strong> {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
