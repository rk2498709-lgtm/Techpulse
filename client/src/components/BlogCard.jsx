import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, ArrowUpRight } from 'lucide-react';

export default function BlogCard({ post }) {
  if (!post) return null;

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  // Category badge color mapper
  const getCategoryClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'software development': return 'badge-blue';
      case 'artificial intelligence & machine learning': return 'badge-purple';
      case 'web & mobile app development': return 'badge-green';
      case 'technology & innovation': return 'badge-amber';
      case 'cybersecurity': return 'badge-red';
      case 'cloud computing': return 'badge-sky';
      case 'industry insights': return 'badge-indigo';
      default: return 'badge-brand';
    }
  };

  return (
    <article className="article-card">
      <Link to={`/blog/${post.slug}`} className="card-image-wrap">
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          className="card-image"
          loading="lazy"
        />
        <span className={`badge ${getCategoryClass(post.category)} card-category-floating`}>
          {post.category}
        </span>
      </Link>

      <div className="card-content">
        <div className="card-meta">
          <span className="card-meta-item">
            <Calendar size={13} />
            {formattedDate}
          </span>
          <span>•</span>
          <span className="card-meta-item">
            <Clock size={13} />
            {post.readingTime || 5} min read
          </span>
          {post.views !== undefined && (
            <>
              <span>•</span>
              <span className="card-meta-item">
                <Eye size={13} />
                {post.views.toLocaleString()}
              </span>
            </>
          )}
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h3 className="card-title">{post.title}</h3>
        </Link>

        <p className="card-excerpt">{post.excerpt}</p>

        <div className="card-footer">
          <div className="author-chip">
            <img
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={post.author?.name || 'Author'}
              className="author-avatar"
            />
            <div>
              <div className="author-name">{post.author?.name || 'TechPulse Staff'}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                {post.author?.role || 'Staff Writer'}
              </div>
            </div>
          </div>

          <Link to={`/blog/${post.slug}`} className="card-read-link">
            <span>Read</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
