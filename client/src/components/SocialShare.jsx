import React, { useState } from 'react';
import { Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react';

export default function SocialShare({ title, url }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
    }
  };

  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap'
    }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-light)', marginRight: '4px' }}>
        Share Article:
      </span>

      <a
        href={shareTwitter}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: '#000000',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 600
        }}
      >
        <Twitter size={13} />
        <span>Post</span>
      </a>

      <a
        href={shareLinkedIn}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: '#0a66c2',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 600
        }}
      >
        <Linkedin size={13} />
        <span>Share</span>
      </a>

      <a
        href={shareFacebook}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: '#1877f2',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 600
        }}
      >
        <Facebook size={13} />
        <span>Share</span>
      </a>

      <button
        onClick={handleCopyLink}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: copied ? '#ecfdf5' : '#ffffff',
          border: '1px solid',
          borderColor: copied ? '#10b981' : 'var(--border)',
          color: copied ? '#059669' : 'var(--text-muted)',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        {copied ? <Check size={13} /> : <Link2 size={13} />}
        <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
      </button>
    </div>
  );
}
