import React from 'react';
import { Layers } from 'lucide-react';

export default function CategoryPills({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '8px',
      marginBottom: '28px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      <button
        onClick={() => onSelectCategory('All')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          border: '1px solid',
          borderColor: selectedCategory === 'All' ? 'var(--brand)' : 'var(--border)',
          backgroundColor: selectedCategory === 'All' ? 'var(--brand)' : '#ffffff',
          color: selectedCategory === 'All' ? '#ffffff' : 'var(--text-muted)',
          boxShadow: selectedCategory === 'All' ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <Layers size={14} />
        All Topics
      </button>

      {categories.map((cat) => {
        const catName = typeof cat === 'string' ? cat : cat.name;
        const isSelected = selectedCategory?.toLowerCase() === catName.toLowerCase();

        return (
          <button
            key={catName}
            onClick={() => onSelectCategory(catName)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: '1px solid',
              borderColor: isSelected ? 'var(--brand)' : 'var(--border)',
              backgroundColor: isSelected ? 'var(--brand)' : '#ffffff',
              color: isSelected ? '#ffffff' : 'var(--text-muted)',
              boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {catName}
            {cat.postCount !== undefined && (
              <span style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-muted)',
                color: isSelected ? '#ffffff' : 'var(--text-light)'
              }}>
                {cat.postCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
