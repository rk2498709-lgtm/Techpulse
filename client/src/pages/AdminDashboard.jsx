import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Layers,
  CheckCircle,
  Clock,
  FileEdit,
  Search,
  Filter,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { postsAPI, categoriesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [deleteModalPost, setDeleteModalPost] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [statsRes, postsRes, catsRes] = await Promise.all([
        postsAPI.getStats(),
        postsAPI.getPosts({ status: 'all', limit: 100 }),
        categoriesAPI.getCategories()
      ]);

      setStats(statsRes.data || {});
      setPosts(postsRes.data || []);
      setCategories(catsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDeletePost = async () => {
    if (!deleteModalPost) return;
    setDeleting(true);
    try {
      const postId = deleteModalPost._id || deleteModalPost.id;
      await postsAPI.deletePost(postId);
      setDeleteModalPost(null);
      await loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  // Filtered posts for the table
  const filteredPosts = posts.filter((p) => {
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchCategory = filterCategory === 'all' || p.category?.toLowerCase() === filterCategory.toLowerCase();
    const matchSearch =
      !searchTerm ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchCategory && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="badge badge-green">Published</span>;
      case 'draft':
        return <span className="badge badge-amber">Draft</span>;
      case 'scheduled':
        return <span className="badge badge-blue">Scheduled</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container">
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>
                Editorial Command Center
              </h1>
              <span className="badge badge-brand">{user?.role?.toUpperCase() || 'ADMIN'}</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '4px' }}>
              Logged in as <strong>{user?.name}</strong> ({user?.email}). Manage articles, categories, and publication state.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/admin/categories" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={15} />
              Manage Categories
            </Link>
            <Link to="/admin/posts/new" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={15} />
              New Article
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '36px'
        }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Total Articles</span>
              <FileText size={18} color="var(--brand)" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary)' }}>
              {stats?.totalPosts || posts.length}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Published</span>
              <CheckCircle size={18} color="#059669" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#059669' }}>
              {stats?.publishedPosts || 0}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Drafts</span>
              <FileEdit size={18} color="#d97706" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#d97706' }}>
              {stats?.draftPosts || 0}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Scheduled</span>
              <Clock size={18} color="#2563eb" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#2563eb' }}>
              {stats?.scheduledPosts || 0}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Total Pageviews</span>
              <Eye size={18} color="#7c3aed" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary)' }}>
              {(stats?.totalViews || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Content Management Section */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Table Action Controls */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
              Published & Draft Articles ({filteredPosts.length})
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={14} color="var(--text-light)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  style={{ padding: '6px 12px 6px 30px', fontSize: '13px', width: '180px' }}
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-control"
                style={{ padding: '6px 10px', fontSize: '13px', width: 'auto' }}
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="scheduled">Scheduled</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-control"
                style={{ padding: '6px 10px', fontSize: '13px', width: 'auto' }}
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-light)' }}>
              Loading articles list...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-light)' }}>
              No articles match the current filter criteria.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => {
                    const postId = post._id || post.id;
                    const dateStr = post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '-';

                    return (
                      <tr key={postId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--primary)', maxWidth: '340px', lineHeight: 1.3 }}>
                                {post.title}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                                Slug: /{post.slug} {post.isFeatured && <span style={{ color: 'var(--brand)', fontWeight: 600 }}>• ★ Featured</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-brand" style={{ fontSize: '11px' }}>
                            {post.category}
                          </span>
                        </td>
                        <td>{getStatusBadge(post.status)}</td>
                        <td>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>{(post.views || 0).toLocaleString()}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{post.author?.name || 'Admin'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>{dateStr}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Link
                              to={`/blog/${post.slug}`}
                              target="_blank"
                              className="btn btn-secondary btn-sm"
                              title="Public Preview"
                              style={{ padding: '6px 8px' }}
                            >
                              <ExternalLink size={14} />
                            </Link>

                            <Link
                              to={`/admin/posts/edit/${postId}`}
                              className="btn btn-secondary btn-sm"
                              title="Edit Article"
                              style={{ padding: '6px 8px' }}
                            >
                              <Edit size={14} color="var(--brand)" />
                            </Link>

                            <button
                              onClick={() => setDeleteModalPost(post)}
                              className="btn btn-sm btn-danger"
                              title="Delete Article"
                              style={{ padding: '6px 8px' }}
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

        {/* Delete Confirmation Modal */}
        {deleteModalPost && (
          <div className="modal-overlay" onClick={() => setDeleteModalPost(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#b91c1c', marginBottom: '16px' }}>
                <AlertTriangle size={24} />
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Confirm Article Deletion</h3>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                Are you sure you want to permanently delete <strong>"{deleteModalPost.title}"</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setDeleteModalPost(null)}
                  className="btn btn-secondary btn-sm"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  className="btn btn-danger btn-sm"
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Article'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
