import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles = ['admin', 'editor'] }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <Loader2 size={32} className="animate-spin" color="var(--brand)" />
        <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>Authenticating session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Access Restricted</h2>
        <p style={{ marginTop: '12px' }}>Your account role ({user?.role}) does not have permission to access this area.</p>
      </div>
    );
  }

  return <Outlet />;
}
