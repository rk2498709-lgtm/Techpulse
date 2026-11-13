import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, TrendingUp, Layers, Newspaper, ShieldCheck } from 'lucide-react';
import { postsAPI, categoriesAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import FeaturedHero from '../components/FeaturedHero';
import CategoryPills from '../components/CategoryPills';

export default function HomePage({ onOpenSearch }) {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [featRes, trendRes, catsRes, postsRes] = await Promise.all([
          postsAPI.getFeatured(),
          postsAPI.getTrending(),
          categoriesAPI.getCategories(),
          postsAPI.getPosts({ limit: 6, status: 'published' })
        ]);

        setFeaturedPosts(featRes.data || []);
        setTrendingPosts(trendRes.data || []);
        setCategories(catsRes.data || []);
        setLatestPosts(postsRes.data || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
  };

  const filteredLatest = selectedCategory === 'All'
    ? latestPosts
    : latestPosts.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div style={{ paddingBottom: '70px' }}>
      {/* Top Banner / Announcement */}
      <div style={{
        backgroundColor: '#f1f5f9',
        borderBottom: '1px solid var(--border)',
        padding: '10px 0',
        fontSize: '13px',
        color: 'var(--text-muted)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-brand" style={{ fontSize: '10px', padding: '2px 6px' }}>2026 EDITION</span>
            <span>Welcome to TechPulse — Engineering Architecture & Advanced AI Insights</span>
          </div>
          <button
            onClick={onOpenSearch}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--brand)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Search Publication <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '36px' }}>
        {/* Featured Editorial Hero */}
        <FeaturedHero featuredPosts={featuredPosts} trendingPosts={trendingPosts} />

        {/* Category Pills Filter */}
        <div style={{ marginTop: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>
              Explore by Technology Domain
            </h2>
            <Link to="/blog" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all topics <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Latest Articles Grid */}
        <section style={{ marginTop: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                Latest Published Articles
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '4px' }}>
                Peer-reviewed engineering insights, tutorials, and architectural breakdowns.
              </p>
            </div>
            <Link to="/blog" className="btn btn-secondary btn-sm">
              All Articles ({latestPosts.length})
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-light)' }}>
              Loading latest insights...
            </div>
          ) : filteredLatest.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text-muted)' }}>No articles found in this category yet.</p>
              <button onClick={() => setSelectedCategory('All')} className="btn btn-outline-brand btn-sm" style={{ marginTop: '12px' }}>
                Reset Filter
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '24px'
            }}>
              {filteredLatest.map((post) => (
                <BlogCard key={post._id || post.slug} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* Trending Highlights Strip */}
        {trendingPosts.length > 0 && (
          <section style={{
            marginTop: '56px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <TrendingUp size={20} color="var(--brand)" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                Most Read Technical Teardowns
              </h3>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px'
            }}>
              {trendingPosts.slice(0, 3).map((item, index) => (
                <div key={item._id || item.slug} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--brand)',
                    opacity: 0.7,
                    lineHeight: 1
                  }}>
                    0{index + 1}
                  </span>
                  <div>
                    <span className="badge badge-gray" style={{ fontSize: '10px', marginBottom: '6px' }}>
                      {item.category}
                    </span>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.4 }}>
                      <Link to={`/blog/${item.slug}`} style={{ color: 'var(--primary)' }}>
                        {item.title}
                      </Link>
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
