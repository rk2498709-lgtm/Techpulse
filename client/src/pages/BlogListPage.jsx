import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCw, BookOpen } from 'lucide-react';
import { postsAPI, categoriesAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import CategoryPills from '../components/CategoryPills';
import Pagination from '../components/Pagination';

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load categories and tags once
  useEffect(() => {
    async function loadMeta() {
      try {
        const [catsRes, tagsRes] = await Promise.all([
          categoriesAPI.getCategories(),
          postsAPI.getTags()
        ]);
        setCategories(catsRes.data || []);
        setTags(tagsRes.data || []);
      } catch (err) {
        console.error('Failed to load categories/tags:', err);
      }
    }
    loadMeta();
  }, []);

  // Update state if URL query changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchTerm(q);
  }, [searchParams]);

  // Fetch articles on filter change
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 9,
          sort: sortBy,
          status: 'published'
        };

        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        if (selectedTag) {
          params.tag = selectedTag;
        }

        const res = await postsAPI.getPosts(params);
        setPosts(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
          setTotalPosts(res.pagination.totalPosts || 0);
        }
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [selectedCategory, searchTerm, selectedTag, sortBy, currentPage]);

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    setCurrentPage(1);
    if (catName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setSelectedTag('');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '36px', textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            backgroundColor: '#eff6ff',
            color: 'var(--brand)',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            <BookOpen size={13} />
            Engineering Index
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
            All Technology Articles & Guides
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
            Filter by domain, search specialized topics, or read our deep-dive architecture tutorials.
          </p>
        </div>

        {/* Filters Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Top row: search + sort + tag */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <Search
                size={16}
                color="var(--text-light)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '38px' }}
              />
            </form>

            {/* Tag Filter */}
            <div>
              <select
                value={selectedTag}
                onChange={(e) => { setSelectedTag(e.target.value); setCurrentPage(1); }}
                className="form-control"
              >
                <option value="">All Tags (Filter by tag)</option>
                {tags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="form-control"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="popular">Sort: Most Viewed / Popular</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="title">Sort: Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          {/* Active Filter Pills & Reset */}
          {(selectedCategory !== 'All' || searchTerm || selectedTag || sortBy !== 'newest') && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '13px'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Showing <strong>{totalPosts}</strong> matching {totalPosts === 1 ? 'article' : 'articles'}
              </span>
              <button
                onClick={handleResetFilters}
                className="btn btn-sm"
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                <RefreshCw size={12} />
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-light)' }}>
            Loading articles...
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: '8px' }}>No articles found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              No articles match your current search or category filters.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '24px'
            }}>
              {posts.map((post) => (
                <BlogCard key={post._id || post.slug} post={post} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
