import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Clock, FileText, Loader2 } from 'lucide-react';
import { postsAPI } from '../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger search modal from parent
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search query
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await postsAPI.getPosts({ search: searchTerm.trim(), limit: 6 });
        setResults(res.data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectPost = (slug) => {
    navigate(`/blog/${slug}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '0', overflow: 'hidden' }}
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)'
        }}>
          <Search size={20} color="var(--brand)" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search engineering articles, AI, cloud, microservices..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '16px',
              color: 'var(--primary)'
            }}
          />
          {loading && <Loader2 size={18} className="animate-spin" color="var(--brand)" />}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-light)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Results Area */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '12px' }}>
          {searchTerm.trim() === '' ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-light)' }}>
              <FileText size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontSize: '14px', marginBottom: '6px' }}>
                Type keywords like <strong>"React"</strong>, <strong>"Kafka"</strong>, or <strong>"AI Agents"</strong>
              </p>
              <span style={{ fontSize: '12px' }}>Press ESC to exit</span>
            </div>
          ) : results.length === 0 && !loading ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-light)' }}>
              <p style={{ fontSize: '14px' }}>No articles found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {results.map((post) => (
                <div
                  key={post._id || post.slug}
                  onClick={() => handleSelectPost(post.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-brand" style={{ fontSize: '10px', padding: '1px 6px' }}>
                        {post.category}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} /> {post.readingTime}m read
                      </span>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {post.title}
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--brand)" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '10px 16px',
          backgroundColor: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-light)'
        }}>
          <span>Navigate using search keywords</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
