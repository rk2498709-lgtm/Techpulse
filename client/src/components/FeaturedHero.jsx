import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

export default function FeaturedHero({ featuredPosts = [], trendingPosts = [] }) {
  if (!featuredPosts.length) return null;

  const mainPost = featuredPosts[0];
  const sidePosts = featuredPosts.slice(1, 4);

  const formatDate = (dateStr) => {
    return dateStr
      ? new Date(dateStr).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : 'Recent';
  };

  return (
    <section style={{ marginBottom: '48px' }}>
      {/* Hero Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 'var(--radius-full)',
        color: 'var(--brand)',
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '20px'
      }}>
        <Sparkles size={14} />
        Featured Editorial
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {/* Main Hero Card (2 columns on desktop) */}
        <div style={{
          gridColumn: 'span 2',
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.25s ease'
        }} className="main-hero-card">
          <div style={{ position: 'relative', width: '100%', height: '360px', overflow: 'hidden' }}>
            <img
              src={mainPost.coverImage}
              alt={mainPost.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.1) 60%, transparent 100%)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px'
            }}>
              <span className="badge badge-brand" style={{ backgroundColor: '#ffffff', color: 'var(--brand)', border: 'none', marginBottom: '10px' }}>
                {mainPost.category}
              </span>
              <h2 style={{
                color: '#ffffff',
                fontSize: '28px',
                lineHeight: 1.25,
                fontWeight: 800,
                marginTop: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }}>
                <Link to={`/blog/${mainPost.slug}`} style={{ color: '#ffffff' }}>
                  {mainPost.title}
                </Link>
              </h2>
            </div>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
              {mainPost.excerpt}
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={mainPost.author?.avatar}
                  alt={mainPost.author?.name}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                    {mainPost.author?.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)', display: 'flex', gap: '8px' }}>
                    <span>{formatDate(mainPost.createdAt)}</span>
                    <span>•</span>
                    <span>{mainPost.readingTime || 5} min read</span>
                  </div>
                </div>
              </div>

              <Link to={`/blog/${mainPost.slug}`} className="btn btn-primary btn-sm">
                <span>Read Story</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Side Stacked Stories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            <TrendingUp size={16} color="var(--brand)" />
            Top Recommended
          </div>

          {sidePosts.map((post) => (
            <article
              key={post._id || post.slug}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                gap: '16px',
                transition: 'all 0.2s ease'
              }}
              className="side-featured-item"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge badge-brand" style={{ fontSize: '10px', padding: '2px 8px' }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                    {post.readingTime} min
                  </span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.35, marginBottom: '6px' }}>
                  <Link to={`/blog/${post.slug}`} style={{ color: 'var(--primary)' }}>
                    {post.title}
                  </Link>
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                  By {post.author?.name || 'Staff'}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .main-hero-card {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
