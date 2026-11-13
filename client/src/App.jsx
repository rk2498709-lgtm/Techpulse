import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';

// Public Pages
import HomePage from './pages/HomePage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminPostEditor from './pages/AdminPostEditor';
import AdminCategoriesPage from './pages/AdminCategoriesPage';

// 404 Page (inline)
function NotFoundPage() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        fontSize: '90px',
        fontWeight: 900,
        fontFamily: 'var(--font-heading)',
        color: 'var(--brand)',
        lineHeight: 1,
        marginBottom: '16px'
      }}>
        404
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '400px' }}>
        The page you're looking for doesn't exist or was moved. Try browsing our latest articles.
      </p>
      <a href="/blog" className="btn btn-primary">
        Browse All Articles
      </a>
    </div>
  );
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Global keyboard shortcut: Ctrl+K opens search
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setSearchOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Hide header/footer on admin pages only for dedicated admin login
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <div className="app-container">
        {/* Global Header */}
        <Header onOpenSearch={() => setSearchOpen(true)} />

        {/* Global Search Modal */}
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            {/* ───── Public Routes ───── */}
            <Route path="/" element={<HomePage onOpenSearch={() => setSearchOpen(true)} />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* ───── Protected Admin Routes ───── */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'editor']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/posts/new" element={<AdminPostEditor />} />
              <Route path="/admin/posts/edit/:id" element={<AdminPostEditor />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            </Route>

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}
