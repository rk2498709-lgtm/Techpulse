import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Check, ArrowRight, Github, Twitter, Linkedin, Rss } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const categories = [
    'Software Development',
    'Artificial Intelligence & Machine Learning',
    'Web & Mobile App Development',
    'Technology & Innovation',
    'Cybersecurity',
    'Cloud Computing',
    'Industry Insights'
  ];

  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      paddingTop: '64px',
      paddingBottom: '32px',
      borderTop: '1px solid #1e293b'
    }}>
      <div className="container">
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '56px'
        }}>
          {/* Column 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '18px'
              }}>
                T
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}>
                Tech<span style={{ color: '#38bdf8' }}>Pulse</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
              The definitive publication for software engineers, architects, and technology leaders. Curating high-signal engineering practices, system designs, and AI architectures.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', padding: '8px', borderRadius: '6px', background: '#1e293b' }}>
                <Twitter size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', padding: '8px', borderRadius: '6px', background: '#1e293b' }}>
                <Linkedin size={16} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', padding: '8px', borderRadius: '6px', background: '#1e293b' }}>
                <Github size={16} />
              </a>
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', padding: '8px', borderRadius: '6px', background: '#1e293b' }}>
                <Rss size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.02em' }}>
              CATEGORIES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/blog?category=${encodeURIComponent(cat)}`}
                    style={{ color: '#94a3b8', fontSize: '14px', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => (e.target.style.color = '#38bdf8')}
                    onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links & SEO */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.02em' }}>
              NAVIGATION & RESOURCES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/" style={{ color: '#94a3b8', fontSize: '14px' }}>Home</Link>
              </li>
              <li>
                <Link to="/blog" style={{ color: '#94a3b8', fontSize: '14px' }}>All Articles</Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#94a3b8', fontSize: '14px' }}>About the Publication</Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#94a3b8', fontSize: '14px' }}>Editorial Contact</Link>
              </li>
              <li>
                <Link to="/admin/login" style={{ color: '#94a3b8', fontSize: '14px' }}>Author & Admin Portal</Link>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontSize: '14px' }}>
                  XML Sitemap
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontSize: '14px' }}>
                  Robots.txt
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
              WEEKLY ENGINEERING BRIEF
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
              Get our curated technical essays, system architecture teardowns, and modern code practices delivered to your inbox every Thursday.
            </p>
            {subscribed ? (
              <div style={{
                backgroundColor: 'rgba(5, 150, 105, 0.2)',
                border: '1px solid #059669',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6ee7b7',
                fontSize: '13px'
              }}>
                <Check size={16} />
                <span>You are subscribed! Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="engineer@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: 'var(--radius-md)',
                      color: '#ffffff',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Subscribe
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} TechPulse Inc. All rights reserved. Built with MERN Stack (React, Node, Express, MongoDB).
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
