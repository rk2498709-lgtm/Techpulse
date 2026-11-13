const dataService = require('../services/dataService');

/**
 * Generate XML Sitemap dynamically
 * Includes static routes, all published blog posts, and category pages
 */
async function getSitemapXml(req, res, next) {
  try {
    const baseUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
    const postsResult = await dataService.findPosts({ status: 'published', limit: 1000 });
    const posts = postsResult.posts || [];
    const categories = await dataService.findCategories();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;

    // Category Pages
    categories.forEach(cat => {
      xml += `  <url>
    <loc>${baseUrl}/blog?category=${encodeURIComponent(cat.name)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Blog Post Pages
    posts.forEach(post => {
      const date = post.updatedAt || post.createdAt || new Date();
      const lastmod = new Date(date).toISOString().split('T')[0];
      xml += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
}

/**
 * Generate robots.txt
 */
function getRobotsTxt(req, res) {
  const baseUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
  const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Allow: /blog
Allow: /blog/*
Disallow: /admin
Disallow: /admin/*
Disallow: /api/admin/*

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
}

module.exports = {
  getSitemapXml,
  getRobotsTxt
};
