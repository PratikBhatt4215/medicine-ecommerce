import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { useToast } from '../components/Toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import { paymentService } from '../services/paymentService';
import { formatCurrency } from '../utils/formatters';

// Add your Stripe Publishable Key here
const stripePromise = loadStripe('pk_test_51SXQtV2VAvluCvnCnpqV5ST9TSrTh1GTd7nOXGIj0reUVkvqhdwp4q8KIXkx8y5aju4y9Egjy3kLffAg4dLBn44z00fJjJwwEB'); // Replace with valid key or use env var

const Checkout = () => {
  const { t } = useTranslation();
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [clientSecret, setClientSecret] = useState("");
  const [paymentId, setPaymentId] = useState(null);

  // Load cart data from backend
  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const data = await cartService.getCart();
      if (Array.isArray(data)) {
        setCart(data);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  // Validate address fields
  function isAddressValid() {
    if (!address.street || address.street.trim().length < 5) {
      showToast('Please enter a valid street address (minimum 5 characters)', 'error');
      return false;
    }
    if (!address.city || address.city.trim().length < 2) {
      showToast('Please enter a valid city name', 'error');
      return false;
    }
    if (!address.state || address.state.trim().length < 2) {
      showToast('Please enter a valid state name', 'error');
      return false;
    }
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) {
      showToast('Please enter a valid 6-digit pincode', 'error');
      return false;
    }
    if (!address.phone || !/^\d{10}$/.test(address.phone)) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return false;
    }
    return true;
  }

  // Format address object to string for backend
  function formatAddressString() {
    return `${address.street}, ${address.city}, ${address.state} - ${address.pincode}, Phone: ${address.phone}`;
  };


  async function handlePlaceOrder(e) {
    e.preventDefault();

    // Validate cart
    if (cart.length === 0) {
      showToast(t('msgCartEmpty'), 'error');
      return;
    }

    // Validate address
    if (!isAddressValid()) {
      return;
    }

    setLoading(true);

    // If online payment is selected but no paymentId (meaning not paid yet)
    if (paymentMethod === 'ONLINE' && !paymentId) {
      showToast(t('errCompletePayment') || "Please complete the payment first", 'error');
      setLoading(false);
      return;
    }

    try {
      const addressString = formatAddressString();
      console.log('Placing order with address:', addressString, 'PaymentId:', paymentId);
      const order = await orderService.createOrder(addressString, paymentId);
      console.log('Order created successfully:', order);
      showToast(t('msgOrderPlaced'), 'success');

      // Delay navigation slightly longer to ensure toast is seen
      setTimeout(() => {
        console.log('Navigating to orders...');
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      showToast(t('errPlaceOrder'), 'error');
      setLoading(false);
    }
  }

  const currentTotal = cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);

  // This effect handles the initialization of the Stripe Payment Intent
  useEffect(() => {
    if (paymentMethod === 'ONLINE' && currentTotal > 0 && !clientSecret) {
      initiatePayment();
    }
  }, [paymentMethod, currentTotal, clientSecret]);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const amountInCents = Math.round(currentTotal * 100);
      const data = await paymentService.createPaymentIntent(amountInCents, 'inr');

      let secret = data.client_secret;

      // Handle case where backend returns stringified JSON
      if (!secret && typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          secret = parsed.client_secret;
        } catch (e) {
          console.error("Failed to parse payment intent", e);
        }
      }

      if (secret) {
        setClientSecret(secret);
      } else {
        console.error("No client secret found in response", data);
        showToast("Failed to initialize payment", "error");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error init payment:", error);
      showToast("Error initializing payment", "error");
      setLoading(false);
    }
  };


  async function handlePaymentSuccess(pid) {
    setPaymentId(pid);

    // Validate address before creating order
    if (!isAddressValid()) {
      return;
    }

    try {
      setLoading(true);
      const addressString = formatAddressString();
      await orderService.createOrder(addressString, pid);
      showToast(t('msgOrderPlaced'), 'success');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error(error);
      setLoading(false);
      showToast("Payment successful but order creation failed. Contact support.", "error");
    }
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>{t('lblCheckout')}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
        <div>
          <div className="card">
            <h3>{t('lblShippingAddress')}</h3>
            <div style={{ marginTop: '20px', display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Street Address *</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="House/Flat No., Building Name, Street"
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>City *</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>State *</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="State"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Pincode *</label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    placeholder="6-digit pincode"
                    required
                    maxLength="6"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone Number *</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit phone"
                    required
                    maxLength="10"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
            <h3 style={{ marginTop: '30px' }}>{t('lblPaymentMethod')}</h3>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                {t('lblCOD')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === 'ONLINE'}
                  onChange={() => setPaymentMethod('ONLINE')}
                />
                Online Payment (Card)
              </label>
            </div>

            {paymentMethod === 'COD' && (
              <div style={{ padding: '20px', background: 'var(--light)', borderRadius: '8px', marginTop: '15px' }}>
                <p>{t('lblCOD')}</p>
              </div>
            )}

            {paymentMethod === 'ONLINE' && clientSecret && (
              <div style={{ marginTop: '20px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <Elements stripe={stripePromise} options={options}>
                  <PaymentForm onSuccess={handlePaymentSuccess} />
                </Elements>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '30px' }}
                disabled={loading}
              >
                {loading ? t('btnPlacingOrder') : t('btnPlaceOrder')}
              </button>
            )}
          </div>
        </div>
      <div className="card" style={{ height: 'fit-content' }}>
        <h3>{t('lblOrderSummary')}</h3>
        <div style={{ marginTop: '20px' }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              <span>{item.medicine.name} x {item.quantity}</span>
              <span>{formatCurrency(item.medicine.price * item.quantity)}</span>
            </div>
          ))}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid var(--border)', fontSize: '20px', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}>
            <span>{t('lblTotal')}:</span>
            <span>{formatCurrency(currentTotal)}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Checkout;
