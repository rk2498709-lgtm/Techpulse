import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { categoriesAPI } from '../services/api';

const COLOR_PRESETS = [
  '#2563EB', '#7C3AED', '#059669', '#D97706',
  '#DC2626', '#0284C7', '#4F46E5', '#0F766E', '#BE185D'
];

const ICON_OPTIONS = [
  'code', 'cpu', 'smartphone', 'zap', 'shield-check', 'cloud', 'trending-up',
  'folder', 'globe', 'server', 'terminal', 'database'
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#2563EB',
    icon: 'folder'
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const res = await categoriesAPI.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      setErrorMessage('Failed to load categories: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#2563EB', icon: 'folder' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (cat) => {
    setEditingId(cat._id || cat.id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      color: cat.color || '#2563EB',
      icon: cat.icon || 'folder'
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (editingId) {
        await categoriesAPI.updateCategory(editingId, formData);
        setSuccessMessage('Category updated successfully.');
      } else {
        await categoriesAPI.createCategory(formData);
        setSuccessMessage('Category created successfully.');
      }
      resetForm();
      await loadCategories();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setSaving(true);
    try {
      await categoriesAPI.deleteCategory(deleteModal._id || deleteModal.id);
      setSuccessMessage(`Category "${deleteModal.name}" deleted.`);
      setDeleteModal(null);
      await loadCategories();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary)' }}>
              Manage Categories
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '4px' }}>
              Add, edit, or remove topic categories used to classify all articles.
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            Add New Category
          </button>
        </div>

        {/* Success / Error Banners */}
        {successMessage && (
          <div style={{
            backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46',
            borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px'
          }}>
            <CheckCircle size={16} />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div style={{
            backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c',
            borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div style={{
            background: '#ffffff', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: '28px',
            boxShadow: 'var(--shadow-md)', marginBottom: '28px'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px', color: 'var(--primary)' }}>
              {editingId ? 'Edit Category' : 'Create New Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Edge Computing"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of this category's focus..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Accent Color</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px',
                          backgroundColor: color, border: formData.color === color ? '3px solid #0f172a' : '1px solid transparent',
                          cursor: 'pointer'
                        }}
                        title={color}
                      />
                    ))}
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      style={{ width: '36px', height: '36px', borderRadius: '6px', cursor: 'pointer', border: 'none' }}
                      title="Custom color"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Icon Name (Lucide)</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="form-control"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview Chip */}
              <div style={{ marginTop: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600 }}>PREVIEW:</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px', borderRadius: 'var(--radius-full)',
                  backgroundColor: formData.color + '1A', color: formData.color,
                  border: `1px solid ${formData.color}40`, fontSize: '13px', fontWeight: 700
                }}>
                  {formData.name || 'Category Name'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary btn-sm"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Table */}
        <div style={{
          background: '#ffffff', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            padding: '20px 24px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <Layers size={18} color="var(--brand)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>
              All Topic Categories ({categories.length})
            </h3>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
              No categories found. Create one above.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Slug / URL</th>
                    <th>Description</th>
                    <th>Articles</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => {
                    const catId = cat._id || cat.id;
                    return (
                      <tr key={catId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '12px', height: '36px', borderRadius: '4px',
                              backgroundColor: cat.color || 'var(--brand)', flexShrink: 0
                            }} />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '14px' }}>
                                {cat.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {cat.slug}
                          </code>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            {cat.description
                              ? cat.description.length > 70
                                ? cat.description.slice(0, 70) + '...'
                                : cat.description
                              : '—'}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-brand" style={{ fontSize: '11px' }}>
                            {cat.postCount ?? '—'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => handleEditClick(cat)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '6px 8px' }}
                              title="Edit"
                            >
                              <Edit size={14} color="var(--brand)" />
                            </button>
                            <button
                              onClick={() => setDeleteModal(cat)}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '6px 8px' }}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '420px', padding: '28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c', marginBottom: '14px' }}>
              <AlertTriangle size={22} />
              <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Delete Category</h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to delete <strong>"{deleteModal.name}"</strong>?
              Articles using this category will <strong>not</strong> be deleted, but will lose their category tag.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setDeleteModal(null)}
                className="btn btn-secondary btn-sm"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger btn-sm"
                disabled={saving}
              >
                {saving ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
