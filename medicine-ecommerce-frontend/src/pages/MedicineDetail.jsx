import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { medicineService } from '../services/medicineService';
import { useCart } from '../context/CartContext';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { formatCurrency } from '../utils/formatters';
import ImageWithFallback from '../components/ImageWithFallback';
import LoadingSpinner from '../components/LoadingSpinner';

const MedicineDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMedicine = async () => {
      try {
        const data = await medicineService.getMedicineById(id);
        setMedicine(data);
      } catch (error) {
        console.error('Error:', error);
        showToast(t('errLoadMedicine'), 'error');
      }
    };

    loadMedicine();
  }, [id, showToast]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(medicine.id, quantity);
      showToast(t('msgAddToCartSuccess'), 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast(t('errAddToCart'), 'error');
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await wishlistService.addToWishlist(medicine.id);
      showToast(t('msgAddToWishlistSuccess'), 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast(t('errAddToWishlist'), 'error');
    }
  };

  if (!medicine) return <LoadingSpinner />;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div style={{ borderRadius: '12px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#f8f9fa' }}>
          <ImageWithFallback
            imageUrl={medicine.imageUrl}
            alt={medicine.name}
            fallbackEmoji="💊"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div>
          <h1>{medicine.name}</h1>
          <p style={{ fontSize: '32px', color: 'var(--primary)', fontWeight: '700', margin: '20px 0' }}>{formatCurrency(medicine.price)}</p>
          <p style={{ color: 'var(--gray)', marginBottom: '20px' }}>{medicine.description}</p>
          <p style={{ marginBottom: '20px' }}>{t('lblStock')}: {medicine.stock} {t('lblUnits')}</p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" max={medicine.stock} style={{ width: '80px' }} />
            <button onClick={handleAddToCart} className="btn btn-primary">{t('btnAddToCart')}</button>
            <button onClick={handleAddToWishlist} className="btn btn-outline">{t('btnAddToWishlist')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetail;
