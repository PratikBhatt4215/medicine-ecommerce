import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { medicineService } from '../services/medicineService';
import { formatCurrency, truncateText } from '../utils/formatters';
import ImageWithFallback from '../components/ImageWithFallback';
import LoadingSpinner from '../components/LoadingSpinner';
import './Medicines.css';

const Medicines = () => {
  const { t } = useTranslation();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categoryId = searchParams.get('category');

  useEffect(() => {
    const loadMedicines = async () => {
      setLoading(true);
      try {
        let data;
        if (searchQuery) {
          data = await medicineService.searchMedicines(searchQuery, 0, 50);
        } else if (categoryId) {
          data = await medicineService.getMedicinesByCategory(categoryId);
        } else {
          data = await medicineService.getAllMedicines(0, 50);
        }
        setMedicines(data.content || data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, [searchQuery, categoryId]);

  if (loading) return <LoadingSpinner />;

  let title = t('lblAllMedicines');
  if (searchQuery) title = `${t('lblSearchResultsFor')} "${searchQuery}"`;
  else if (categoryId) title = t('lblMedicinesInCategory');

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>{title}</h1>
      <div className="grid grid-4" style={{ marginTop: '30px' }}>
        {medicines.length > 0 ? (
          medicines.map(med => (
            <Link to={`/medicines/${med.id}`} key={med.id} className="medicine-card">
              <div className="medicine-image">
                <ImageWithFallback
                  imageUrl={med.imageUrl}
                  alt={med.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h3>{med.name}</h3>
              <p className="medicine-desc">{truncateText(med.description, 80)}</p>
              <div className="medicine-footer">
                <span className="price">{formatCurrency(med.price)}</span>
                <span className="stock">{t('lblStock')}: {med.stock}</span>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'var(--gray)' }}>
            <h3>{t('msgNoMedicinesFound')}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicines;
