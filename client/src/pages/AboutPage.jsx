import React from 'react';
import { ShieldCheck, Code, Globe, Zap, Users, Award, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ maxWidth: '780px', margin: '0 auto 64px', textAlign: 'center' }}>
          <span className="badge badge-brand" style={{ marginBottom: '14px' }}>
            About TechPulse
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '20px' }}>
            Empowering modern engineers through deep-signal technical insights.
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
            TechPulse was founded to provide developers, architects, and technology leaders with clear, peer-tested perspectives on distributed systems, AI advancements, and software best practices.
          </p>
        </div>

        {/* Core Values Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px',
          marginBottom: '64px'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#eff6ff',
              color: 'var(--brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Code size={22} />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '10px' }}>Real Code & Architecture</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              We avoid superficial summaries. Every technical breakdown includes production-ready code examples, trade-off analyses, and architecture diagrams.
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#f5f3ff',
              color: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Zap size={22} />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '10px' }}>Autonomous AI Frontier</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Exploring multi-agent swarms, LLM orchestration, vector databases, and neural models with a pragmatic engineering focus.
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#ecfdf5',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '10px' }}>Zero Trust & Security</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Security is not an afterthought. We rigorously cover cryptographic protocols, post-quantum encryption, and threat modeling.
            </p>
          </div>
        </div>

        {/* Editorial Standards Box */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '16px' }}>Our Editorial Principles</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
            Inspired by modern engineering benchmarks, our content passes strict peer review by active software architects. We do not accept sponsored product reviews disguised as journalism. Every code block is verified for correctness, performance, and best practices.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand)' }}>100%</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>Technical Accuracy Focus</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand)' }}>7</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>Core Technology Domains</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand)' }}>Zero</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>Intrusive Popups or Paywalls</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
