import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

export default function CodeBlock({ code, language = 'text' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback
    }
  };

  return (
    <div style={{
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      backgroundColor: '#0f172a',
      border: '1px solid #1e293b',
      margin: '24px 0',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Code Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={14} color="#38bdf8" />
          <span style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: '#94a3b8',
            textTransform: 'uppercase'
          }}>
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '4px',
            color: copied ? '#4ade80' : '#e2e8f0',
            fontSize: '12px',
            padding: '4px 8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Content */}
      <pre style={{
        padding: '18px',
        margin: 0,
        overflowX: 'auto',
        fontSize: '13.5px',
        lineHeight: 1.6,
        color: '#f8fafc',
        fontFamily: 'var(--font-mono)'
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
