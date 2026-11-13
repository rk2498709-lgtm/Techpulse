import React from 'react';
import BlogCard from './BlogCard';
import { Compass } from 'lucide-react';

export default function RelatedPosts({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section style={{ marginTop: '56px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '20px',
        fontWeight: 800,
        color: 'var(--primary)',
        marginBottom: '24px'
      }}>
        <Compass size={22} color="var(--brand)" />
        Related Articles in This Topic
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {posts.map((post) => (
          <BlogCard key={post._id || post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
