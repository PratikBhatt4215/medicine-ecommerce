import React, { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../components/Toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', imageUrl: '' });
  const [editId, setEditId] = useState(null);
  const { showToast } = useToast();

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to load categories', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await categoryService.updateCategory(editId, formData);
        showToast('Category updated successfully');
      } else {
        await categoryService.createCategory(formData);
        showToast('Category created successfully');
      }
      setFormData({ name: '', description: '', imageUrl: '' });
      setEditId(null);
      setShowForm(false);
      loadCategories();
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to save category', 'error');
    }
  };

  const handleEdit = (cat) => {
    setFormData(cat);
    setEditId(cat.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await categoryService.deleteCategory(id);
        showToast('Category deleted successfully');
        loadCategories();
      } catch (error) {
        console.error('Error:', error);
        showToast('Failed to delete category (Ensure it is not used)', 'error');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Manage Categories</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setFormData({ name: '', description: '', imageUrl: '' });
              setEditId(null);
            }
          }}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>{editId ? 'Edit' : 'Add'} Category</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label>Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3"></textarea>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Image URL</label>
              <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}

      <div className="grid grid-3">
        {categories.map(cat => (
          <div key={cat.id} className="card">
            {cat.imageUrl && <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />}
            <h3>{cat.name}</h3>
            <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '15px' }}>{cat.description}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(cat)} className="btn btn-outline" style={{ flex: 1 }}>Edit</button>
              <button onClick={() => handleDelete(cat.id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCategories;
