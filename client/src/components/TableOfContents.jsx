import React from 'react';
import { List, ChevronRight } from 'lucide-react';

export default function TableOfContents({ headings = [] }) {
  if (!headings.length) return null;

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 700,
        color: 'var(--primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '14px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '10px'
      }}>
        <List size={16} color="var(--brand)" />
        Table of Contents
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {headings.map((h, idx) => (
          <button
            key={idx}
            onClick={() => scrollToHeading(h.id)}
            style={{
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              lineHeight: 1.4,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              paddingLeft: h.level === 3 ? '14px' : '0px',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <ChevronRight size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
            <span>{h.text}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
