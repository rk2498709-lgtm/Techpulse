import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Eye, ChevronRight, User, Share2, Tag, Bookmark } from 'lucide-react';
import { postsAPI } from '../services/api';
import TableOfContents from '../components/TableOfContents';
import SocialShare from '../components/SocialShare';
import CodeBlock from '../components/CodeBlock';
import RelatedPosts from '../components/RelatedPosts';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        setError(null);
        const res = await postsAPI.getPostBySlug(slug);
        const currentPost = res.data;
        setPost(currentPost);
        setRelatedPosts(res.relatedPosts || []);

        // Dynamic SEO Metadata
        document.title = `${currentPost.title} — TechPulse`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', currentPost.excerpt || currentPost.title);

        // Extract headings for Table of Contents
        if (currentPost.content) {
          const lines = currentPost.content.split('\n');
          const extractedHeadings = [];
          lines.forEach((line) => {
            const h2Match = line.match(/^##\s+(.+)$/);
            const h3Match = line.match(/^###\s+(.+)$/);
            if (h2Match) {
              const text = h2Match[1].trim();
              const id = text.toLowerCase().replace(/[^\w]+/g, '-');
              extractedHeadings.push({ text, id, level: 2 });
            } else if (h3Match) {
              const text = h3Match[1].trim();
              const id = text.toLowerCase().replace(/[^\w]+/g, '-');
              extractedHeadings.push({ text, id, level: 3 });
            }
          });
          setHeadings(extractedHeadings);
        }

        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Article not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center', color: 'var(--text-light)' }}>
        Loading article content...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '12px' }}>Article Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          {error || 'The article you are looking for does not exist or may have been moved.'}
        </p>
        <Link to="/blog" className="btn btn-primary">
          Browse All Articles
        </Link>
      </div>
    );
  }

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  /**
   * Custom parser for markdown article content (headings with IDs, code blocks, quotes, paragraphs)
   */
  const renderFormattedContent = (content) => {
    if (!content) return null;

    // Split on code block markers ```
    const segments = content.split(/(```[\s\S]*?```)/g);

    return segments.map((seg, sIdx) => {
      // Is code block?
      if (seg.startsWith('```') && seg.endsWith('```')) {
        const lines = seg.slice(3, -3).trim().split('\n');
        const firstLine = lines[0].trim();
        let lang = 'javascript';
        let codeBody = lines.join('\n');
        if (/^[a-zA-Z0-9_-]+$/.test(firstLine)) {
          lang = firstLine;
          codeBody = lines.slice(1).join('\n');
        }
        return <CodeBlock key={sIdx} code={codeBody} language={lang} />;
      }

      // Prose lines
      const paragraphs = seg.split('\n\n').filter(Boolean);
      return paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();

        // Heading 2
        if (trimmed.startsWith('## ')) {
          const text = trimmed.replace(/^##\s+/, '');
          const id = text.toLowerCase().replace(/[^\w]+/g, '-');
          return (
            <h2 id={id} key={`${sIdx}-${pIdx}`}>
              {text}
            </h2>
          );
        }

        // Heading 3
        if (trimmed.startsWith('### ')) {
          const text = trimmed.replace(/^###\s+/, '');
          const id = text.toLowerCase().replace(/[^\w]+/g, '-');
          return (
            <h3 id={id} key={`${sIdx}-${pIdx}`}>
              {text}
            </h3>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '');
          return (
            <blockquote key={`${sIdx}-${pIdx}`}>
              {quoteText}
            </blockquote>
          );
        }

        // Bullet list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter(l => l.startsWith('- ') || l.startsWith('* '));
          return (
            <ul key={`${sIdx}-${pIdx}`}>
              {items.map((item, iIdx) => (
                <li key={iIdx}>{item.replace(/^[-*]\s+/, '')}</li>
              ))}
            </ul>
          );
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n').filter(l => /^\d+\.\s/.test(l));
          return (
            <ol key={`${sIdx}-${pIdx}`}>
              {items.map((item, iIdx) => (
                <li key={iIdx}>{item.replace(/^\d+\.\s+/, '')}</li>
              ))}
            </ol>
          );
        }

        // Standard paragraph
        return (
          <p key={`${sIdx}-${pIdx}`}>
            {trimmed}
          </p>
        );
      });
    });
  };

  return (
    <div style={{ padding: '32px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          color: 'var(--text-light)',
          marginBottom: '24px'
        }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/blog" style={{ color: 'var(--text-muted)' }}>Articles</Link>
          <ChevronRight size={14} />
          <Link to={`/blog?category=${encodeURIComponent(post.category)}`} style={{ color: 'var(--brand)', fontWeight: 600 }}>
            {post.category}
          </Link>
        </nav>

        {/* Article Header */}
        <div style={{ maxWidth: '840px', marginBottom: '32px' }}>
          <span className="badge badge-brand" style={{ marginBottom: '14px' }}>
            {post.category}
          </span>
          <h1 style={{
            fontSize: '38px',
            lineHeight: 1.25,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--primary)',
            marginBottom: '16px'
          }}>
            {post.title}
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
            {post.excerpt}
          </p>

          {/* Author & Meta Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={post.author?.avatar}
                alt={post.author?.name}
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>
                  {post.author?.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)', display: 'flex', gap: '8px' }}>
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span>{post.readingTime} min read</span>
                  {post.views !== undefined && (
                    <>
                      <span>•</span>
                      <span>{post.views} views</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Social Sharing Header */}
            <SocialShare title={post.title} />
          </div>
        </div>

        {/* Cover Image */}
        <div style={{
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: '44px',
          boxShadow: 'var(--shadow-md)',
          maxHeight: '520px'
        }}>
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '520px' }}
          />
        </div>

        {/* Article Body + Table of Contents Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: headings.length > 0 ? '1fr 320px' : '1fr',
          gap: '48px',
          alignItems: 'start'
        }} className="article-layout-grid">
          {/* Main Article Content */}
          <div style={{ minWidth: 0 }}>
            <div className="article-body">
              {renderFormattedContent(post.content)}
            </div>

            {/* Tags Strip */}
            {post.tags && post.tags.length > 0 && (
              <div style={{
                marginTop: '40px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <Tag size={16} color="var(--text-light)" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Tags:</span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="badge badge-gray"
                    style={{ textTransform: 'none', fontSize: '12px' }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Bottom Social Share */}
            <div style={{
              marginTop: '28px',
              padding: '20px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                Enjoyed this deep dive? Share it with other engineers:
              </span>
              <SocialShare title={post.title} />
            </div>

            {/* Author Bio Box */}
            <div style={{
              marginTop: '40px',
              padding: '28px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              display: 'flex',
              gap: '20px',
              alignItems: 'center'
            }}>
              <img
                src={post.author?.avatar}
                alt={post.author?.name}
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                    {post.author?.name}
                  </h4>
                  <span className="badge badge-brand" style={{ fontSize: '10px' }}>
                    {post.author?.role || 'Author'}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {post.author?.bio || 'Senior software engineer and systems architect specializing in cloud infrastructure and high-throughput systems.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Table of Contents Sidebar */}
          {headings.length > 0 && (
            <aside style={{ position: 'sticky', top: '100px' }} className="article-toc-sidebar">
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>

        {/* Related Articles Component */}
        <RelatedPosts posts={relatedPosts} />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .article-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .article-toc-sidebar {
            order: -1;
            position: static !important;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
}
