import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { cartService } from '../services/cartService';
import { formatCurrency } from '../utils/formatters';
import ImageWithFallback from '../components/ImageWithFallback';

const Cart = () => {
  const { t } = useTranslation();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { updateQuantity: updateCartQuantity, removeFromCart: removeCartItem } = useCart();

  // Load cart data from backend
  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  async function updateQuantity(id, quantity) {
    try {
      await updateCartQuantity(id, quantity);
      loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  async function removeItem(id) {
    try {
      await removeCartItem(id);
      loadCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  const total = cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>{t('lblShoppingCart')}</h1>
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p>{t('msgCartEmpty')}</p>
          <Link to="/medicines" className="btn btn-primary" style={{ marginTop: '20px' }}>{t('btnShopNow')}</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
          <div>
            {cart.map(item => (
              <div key={item.id} className="card" style={{ marginBottom: '15px', display: 'flex', gap: '20px' }}>
                <div style={{ width: '100px', height: '100px', background: 'var(--light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <ImageWithFallback
                    imageUrl={item.medicine.imageUrl}
                    alt={item.medicine.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h3>{item.medicine.name}</h3>
                  <p style={{ color: 'var(--gray)', fontSize: '14px' }}>{item.medicine.description?.substring(0, 100)}</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)', marginTop: '10px' }}>
                    {formatCurrency(item.medicine.price)}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, e.target.value)} min="1" style={{ width: '80px' }} />
                  <button onClick={() => removeItem(item.id)} className="btn btn-danger">{t('btnRemove')}</button>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ height: 'fit-content' }}>
            <h3>{t('lblOrderSummary')}</h3>
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{t('lblSubtotal')}:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>
                <span>{t('lblTotal')}:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%' }}>{t('btnProceedToCheckout')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
