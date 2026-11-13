import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Shield, Menu, X, ArrowRight, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onOpenSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--header-height)'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '20px',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            T
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '21px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--primary)',
              lineHeight: 1
            }}>
              Tech<span style={{ color: 'var(--brand)' }}>Pulse</span>
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-light)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Engineering & Insights
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '28px',
          fontWeight: 600,
          fontSize: '14px'
        }} className="desktop-nav">
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? 'var(--brand)' : 'var(--text-muted)',
              borderBottom: isActive ? '2px solid var(--brand)' : '2px solid transparent',
              padding: '6px 0'
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/blog"
            style={({ isActive }) => ({
              color: isActive ? 'var(--brand)' : 'var(--text-muted)',
              borderBottom: isActive ? '2px solid var(--brand)' : '2px solid transparent',
              padding: '6px 0'
            })}
          >
            Articles
          </NavLink>
          <NavLink
            to="/about"
            style={({ isActive }) => ({
              color: isActive ? 'var(--brand)' : 'var(--text-muted)',
              borderBottom: isActive ? '2px solid var(--brand)' : '2px solid transparent',
              padding: '6px 0'
            })}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            style={({ isActive }) => ({
              color: isActive ? 'var(--brand)' : 'var(--text-muted)',
              borderBottom: isActive ? '2px solid var(--brand)' : '2px solid transparent',
              padding: '6px 0'
            })}
          >
            Contact
          </NavLink>
        </nav>

        {/* Actions (Search, Admin, Mobile Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="search-trigger-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Search articles (Ctrl+K)"
          >
            <Search size={16} />
            <span style={{ display: 'none' }} className="search-text-label">Search...</span>
            <kbd style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '2px 5px',
              fontSize: '11px',
              color: 'var(--text-light)',
              fontFamily: 'var(--font-mono)'
            }}>
              Ctrl+K
            </kbd>
          </button>

          {/* Admin Dashboard / Sign In */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/admin" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} color="var(--brand)" />
                <span>Admin Panel</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-sm"
                style={{ backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                title="Log out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} />
              <span>Admin Login</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px',
              cursor: 'pointer'
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontWeight: 600, color: 'var(--primary)' }}
          >
            Home
          </Link>
          <Link
            to="/blog"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontWeight: 600, color: 'var(--primary)' }}
          >
            Articles
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontWeight: 600, color: 'var(--primary)' }}
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontWeight: 600, color: 'var(--primary)' }}
          >
            Contact
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .search-text-label { display: inline !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
