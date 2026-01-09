import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { categoryService } from '../services/categoryService';
import { medicineService } from '../services/medicineService';
import FeaturesSection from '../components/FeaturesSection';
import { formatCurrency, truncateText } from '../utils/formatters';
import ImageWithFallback from '../components/ImageWithFallback';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cats, meds] = await Promise.all([
        categoryService.getAllCategories(),
        medicineService.getAllMedicines(0, 8)
      ]);
      setCategories(cats.slice(0, 8));
      setMedicines(meds.content || meds);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>{t('lblHeroTitle')}</h1>
          <p>{t('lblHeroSubtitle')}</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/medicines" className="btn btn-primary btn-large">
              {t('btnShopNow')}
            </Link>
            <Link to="/register" className="btn btn-large" style={{ background: 'white', color: '#764ba2' }}>
              {t('btnJoinUs')}
            </Link>
          </div>
        </div>
      </section>

      <FeaturesSection />

      <section className="section">
        <div className="container">
          <h2 className="section-title">{t('lblPopularCategories')}</h2>
          <div className="grid grid-4">
            {categories.map(cat => (
              <Link to={`/medicines?category=${cat.id}`} key={cat.id} className="category-card">
                <div className="category-icon">
                  <ImageWithFallback
                    imageUrl={cat.imageUrl}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3>{cat.name}</h3>
                <p>{truncateText(cat.description, 60)}</p>
              </Link>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '30px' }}>
            <Link to="/medicines" className="btn btn-outline">{t('btnViewAllCategories')}</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title">{t('lblFeaturedMedicines')}</h2>
          <div className="grid grid-4">
            {medicines.map(med => (
              <Link to={`/medicines/${med.id}`} key={med.id} className="medicine-card">
                <div className="medicine-image">
                  <ImageWithFallback
                    imageUrl={med.imageUrl}
                    alt={med.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3>{med.name}</h3>
                <p className="medicine-desc">{truncateText(med.description, 60)}</p>
                <div className="medicine-footer">
                  <span className="price">{formatCurrency(med.price)}</span>
                  <span className="stock">{t('lblStock')}: {med.stock}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
