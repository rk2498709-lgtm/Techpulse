import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  Search,
  Globe,
  Tag,
  Clock,
  Layers,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { postsAPI, categoriesAPI } from '../services/api';
import CodeBlock from '../components/CodeBlock';

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Cloud / Serverless', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI & Neural Nets', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cybersecurity & Code', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Frontend / React', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80' }
];

export default function AdminPostEditor() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Software Development',
    tags: '',
    coverImage: SAMPLE_IMAGE_PRESETS[0].url,
    status: 'published',
    scheduledAt: '',
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  // Load existing categories and post (if editing)
  useEffect(() => {
    async function init() {
      try {
        const catRes = await categoriesAPI.getCategories();
        setCategories(catRes.data || []);

        if (isEditMode) {
          const postRes = await postsAPI.getPostById(id);
          const post = postRes.data;
          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            category: post.category || 'Software Development',
            tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
            coverImage: post.coverImage || SAMPLE_IMAGE_PRESETS[0].url,
            status: post.status || 'published',
            scheduledAt: post.scheduledAt ? post.scheduledAt.split('T')[0] : '',
            isFeatured: Boolean(post.isFeatured),
            metaTitle: post.seo?.metaTitle || post.title || '',
            metaDescription: post.seo?.metaDescription || post.excerpt || '',
            metaKeywords: Array.isArray(post.seo?.metaKeywords) ? post.seo.metaKeywords.join(', ') : ''
          });
        }
      } catch (err) {
        setErrorMessage('Failed to load article data: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, isEditMode]);

  // Auto slug generator when typing title (in create mode)
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    const autoSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/&/g, '-and-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: !isEditMode || !prev.slug ? autoSlug : prev.slug,
      metaTitle: !prev.metaTitle ? newTitle : prev.metaTitle
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        coverImage: formData.coverImage,
        status: formData.status,
        scheduledAt: formData.status === 'scheduled' && formData.scheduledAt ? new Date(formData.scheduledAt) : null,
        isFeatured: Boolean(formData.isFeatured),
        seo: {
          metaTitle: formData.metaTitle || formData.title,
          metaDescription: formData.metaDescription || formData.excerpt,
          metaKeywords: formData.metaKeywords ? formData.metaKeywords.split(',').map((k) => k.trim()) : []
        }
      };

      if (isEditMode) {
        await postsAPI.updatePost(id, payload);
        setSuccessMessage('Article updated successfully!');
      } else {
        await postsAPI.createPost(payload);
        setSuccessMessage('Article published successfully!');
        setTimeout(() => navigate('/admin'), 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Loading article editor...</div>;
  }

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>
              {isEditMode ? 'Edit Article' : 'Compose New Article'}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '4px' }}>
              Create rich technical content with code snippets, table of contents, and SEO optimization.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'write' ? 'preview' : 'write')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Eye size={15} />
              {activeTab === 'write' ? 'Preview Output' : 'Back to Editor'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save size={15} />
              {saving ? 'Saving...' : isEditMode ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <CheckCircle size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '28px', alignItems: 'start' }} className="editor-grid">
            {/* Left Main Form Column */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {/* Title Input */}
              <div className="form-group">
                <label className="form-label">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus in Cloud-Native Databases"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="form-control"
                  style={{ fontSize: '16px', fontWeight: 700 }}
                />
              </div>

              {/* Slug Input */}
              <div className="form-group">
                <label className="form-label">SEO Slug (URL Path)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>/blog/</span>
                  <input
                    type="text"
                    required
                    placeholder="distributed-consensus-cloud-databases"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="form-control"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="form-group">
                <label className="form-label">Article Excerpt / Abstract *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="A concise 1-2 sentence teaser shown on cards and search engine results..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value, metaDescription: !formData.metaDescription ? e.target.value : formData.metaDescription })}
                  className="form-control"
                />
              </div>

              {/* Content Editor / Preview Tabs */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Article Content (Markdown Supported) *
                  </label>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                    Use <code>## Heading</code>, <code>### Subheading</code>, <code>```js code```</code>
                  </div>
                </div>

                {activeTab === 'write' ? (
                  <textarea
                    required
                    rows={18}
                    placeholder="Write article markdown here...&#10;&#10;## Introduction&#10;Your detailed engineering insights...&#10;&#10;```javascript&#10;console.log('Production ready code');&#10;```"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="form-control"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: 1.6 }}
                  />
                ) : (
                  <div style={{
                    padding: '24px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    minHeight: '380px'
                  }}>
                    <div className="article-body">
                      {formData.content ? (
                        formData.content.split('\n\n').map((para, idx) => {
                          if (para.startsWith('## ')) return <h2 key={idx}>{para.replace('## ', '')}</h2>;
                          if (para.startsWith('### ')) return <h3 key={idx}>{para.replace('### ', '')}</h3>;
                          if (para.startsWith('```')) return <pre key={idx}><code>{para.replace(/```[a-z]*/g, '')}</code></pre>;
                          return <p key={idx}>{para}</p>;
                        })
                      ) : (
                        <p style={{ color: 'var(--text-light)' }}>No content written yet. Switch to write mode.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Meta Section */}
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Globe size={18} color="var(--brand)" />
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>
                    SEO Metadata & Open Graph Tags
                  </h3>
                </div>

                <div className="form-group">
                  <label className="form-label">Meta Title (Page & Search Result Title)</label>
                  <input
                    type="text"
                    placeholder="Meta Title"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Meta Description</label>
                  <input
                    type="text"
                    placeholder="Search snippet summary..."
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Keywords (comma separated)</label>
                  <input
                    type="text"
                    placeholder="microservices, nodejs, kafka, security"
                    value={formData.metaKeywords}
                    onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            {/* Right Settings Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Publication Status Box */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                  Publication Status
                </h3>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-control"
                  >
                    <option value="published">Published (Public)</option>
                    <option value="draft">Save as Draft</option>
                    <option value="scheduled">Schedule for Future</option>
                  </select>
                </div>

                {formData.status === 'scheduled' && (
                  <div className="form-group">
                    <label className="form-label">Schedule Date</label>
                    <input
                      type="date"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      className="form-control"
                    />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isFeatured" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}>
                    ★ Feature on Homepage Hero
                  </label>
                </div>
              </div>

              {/* Taxonomy (Category & Tags) */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                  Taxonomy & Classification
                </h3>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control"
                    required
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="Software Development">Software Development</option>
                        <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                        <option value="Web & Mobile App Development">Web & Mobile App Development</option>
                        <option value="Technology & Innovation">Technology & Innovation</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Cloud Computing">Cloud Computing</option>
                        <option value="Industry Insights">Industry Insights</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Architecture, DevOps"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', color: 'var(--primary)' }}>
                  Cover Image
                </h3>

                {formData.coverImage && (
                  <div style={{ width: '100%', height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '12px' }}>
                    <img
                      src={formData.coverImage}
                      alt="Cover Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '12px' }}
                  />
                </div>

                {/* Preset Suggestions */}
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-light)', marginBottom: '8px' }}>
                  QUICK PRESET IMAGES:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {SAMPLE_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11px', padding: '5px 8px', textAlign: 'left' }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .editor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
