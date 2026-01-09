import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { wishlistService } from '../services/wishlistService';
import { formatCurrency, truncateText } from '../utils/formatters';
import ImageWithFallback from '../components/ImageWithFallback';

const Wishlist = () => {
  const { t } = useTranslation();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      const data = await wishlistService.getWishlist();
      // Handle both direct array and wrapped response
      if (Array.isArray(data)) {
        setWishlist(data);
      } else if (data && Array.isArray(data.data)) {
        setWishlist(data.data);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlist([]);
    }
  }

  async function removeItem(medicineId) {
    try {
      await wishlistService.removeFromWishlist(medicineId);
      loadWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>{t('lblMyWishlist')}</h1>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p>{t('msgWishlistEmpty')}</p>
          <Link to="/medicines" className="btn btn-primary" style={{ marginTop: '20px' }}>{t('btnBrowseMedicines')}</Link>
        </div>
      ) : (
        <div className="grid grid-4" style={{ marginTop: '30px' }}>
          {wishlist.map(item => (
            <div key={item.id} className="card">
              <div style={{ background: 'var(--light)', height: '150px', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', marginBottom: '15px', overflow: 'hidden' }}>
                <ImageWithFallback
                  imageUrl={item.medicine.imageUrl}
                  alt={item.medicine.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h3>{item.medicine.name}</h3>
              <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '10px' }}>
                {truncateText(item.medicine.description, 60)}
              </p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)', marginBottom: '15px' }}>
                {formatCurrency(item.medicine.price)}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/medicines/${item.medicine.id}`} className="btn btn-primary" style={{ flex: 1 }}>{t('btnView')}</Link>
                <button onClick={() => removeItem(item.medicine.id)} className="btn btn-danger">{t('btnRemove')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
