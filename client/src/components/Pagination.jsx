import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      marginTop: '40px'
    }} aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="btn btn-secondary btn-sm"
        style={{
          opacity: currentPage <= 1 ? 0.4 : 1,
          cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
        }}
      >
        <ChevronLeft size={16} />
        <span>Prev</span>
      </button>

      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: isActive ? 'var(--brand)' : 'var(--border)',
              backgroundColor: isActive ? 'var(--brand)' : '#ffffff',
              color: isActive ? '#ffffff' : 'var(--primary)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="btn btn-secondary btn-sm"
        style={{
          opacity: currentPage >= totalPages ? 0.4 : 1,
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
