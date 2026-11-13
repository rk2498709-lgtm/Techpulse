import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'Software Development',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-brand" style={{ marginBottom: '14px' }}>
            Get In Touch
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Connect with the TechPulse Editorial Team
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
            Have a technical article proposal, feedback on a publication, or a partnership inquiry?
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '36px'
        }}>
          {/* Contact Details Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Editorial Headquarters</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              We welcome submissions from open-source maintainers, cloud architects, and research scientists.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '8px', color: 'var(--brand)' }}>
                <Mail size={18} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600 }}>EDITORIAL EMAIL</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>editorial@techpulse.io</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ padding: '10px', background: '#f5f3ff', borderRadius: '8px', color: 'var(--accent-purple)' }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600 }}>PRESS & MEDIA</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>press@techpulse.io</div>
              </div>
            </div>

            <div style={{
              marginTop: 'auto',
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              color: 'var(--text-muted)'
            }}>
              💡 <strong>Want to write for us?</strong> Send your draft outline along with a link to your GitHub repository or technical portfolio.
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <CheckCircle2 size={48} color="#059669" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Message Received</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Thank you for reaching out. An editor from our team will review your inquiry within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', category: 'Software Development', message: '' });
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="s.connor@enterprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Topic Area</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control"
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                    <option value="Web & Mobile App Development">Web & Mobile App Development</option>
                    <option value="Technology & Innovation">Technology & Innovation</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Industry Insights">Industry Insights</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Article Proposal: Edge Computing Patterns"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Outline</label>
                  <textarea
                    required
                    placeholder="Tell us what you would like to discuss..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-control"
                    rows={4}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Send size={15} />
                  Send Editorial Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
