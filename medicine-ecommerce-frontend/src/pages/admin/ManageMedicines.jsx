import React, { useState, useEffect, useCallback } from 'react';
import { medicineService } from '../../services/medicineService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../components/Toast';

const ManageMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
  const [editId, setEditId] = useState(null);
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [meds, cats] = await Promise.all([
        medicineService.getAllMedicines(0, 100),
        categoryService.getAllCategories()
      ]);
      setMedicines(meds.content || meds);
      setCategories(cats);
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to load data', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure category is sent as an object with ID
      const data = {
        ...formData,
        category: { id: parseInt(formData.category) }
      };

      if (editId) {
        await medicineService.updateMedicine(editId, data);
        showToast('Medicine updated successfully');
      } else {
        await medicineService.createMedicine(data);
        showToast('Medicine created successfully');
      }
      setFormData({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
      setEditId(null);
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to save medicine', 'error');
    }
  };

  const handleEdit = (med) => {
    setFormData({
      name: med.name,
      description: med.description,
      price: med.price,
      stock: med.stock,
      imageUrl: med.imageUrl || '',
      category: med.category ? med.category.id : ''
    });
    setEditId(med.id);
    setShowForm(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this medicine?')) {
      try {
        await medicineService.deleteMedicine(id);
        showToast('Medicine deleted successfully');
        loadData();
      } catch (error) {
        console.error('Error:', error);
        showToast('Failed to delete medicine', 'error');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Manage Medicines</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setFormData({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
              setEditId(null);
            }
          }}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Medicine'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>{editId ? 'Edit' : 'Add'} Medicine</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label>Price</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              </div>
              <div>
                <label>Stock</label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <label>Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3"></textarea>
            </div>
            <div style={{ marginTop: '15px' }}>
              <label>Image URL</label>
              <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '15px' }}>Save</button>
          </form>
        </div>
      )}

      <div className="grid grid-4">
        {medicines.map(med => (
          <div key={med.id} className="card">
            {med.imageUrl && <img src={med.imageUrl} alt={med.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />}
            <h3>{med.name}</h3>
            <p style={{ color: 'var(--gray)', fontSize: '14px' }}>{med.description?.substring(0, 60)}...</p>
            <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)', margin: '10px 0' }}>₹{med.price}</p>
            <p style={{ fontSize: '12px', color: 'var(--gray)', marginBottom: '15px' }}>Stock: {med.stock}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(med)} className="btn btn-outline" style={{ flex: 1 }}>Edit</button>
              <button onClick={() => handleDelete(med.id)} className="btn btn-danger" style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMedicines;
