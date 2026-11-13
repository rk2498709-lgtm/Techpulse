const dataService = require('../services/dataService');

// @desc    Get all posts (with search, category filter, tag filter, pagination)
// @route   GET /api/posts
// @access  Public
async function getPosts(req, res, next) {
  try {
    const { category, tag, search, sort, page, limit, status, isFeatured } = req.query;

    const result = await dataService.findPosts({
      category,
      tag,
      search,
      sort,
      page,
      limit,
      status: status || 'published',
      isFeatured
    });

    res.json({
      success: true,
      data: result.posts,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        totalPosts: result.totalPosts
      }
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get featured posts for homepage hero
// @route   GET /api/posts/featured
// @access  Public
async function getFeaturedPosts(req, res, next) {
  try {
    const result = await dataService.findPosts({
      status: 'published',
      isFeatured: true,
      limit: 4
    });

    res.json({
      success: true,
      data: result.posts
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get trending posts based on view count
// @route   GET /api/posts/trending
// @access  Public
async function getTrendingPosts(req, res, next) {
  try {
    const result = await dataService.findPosts({
      status: 'published',
      sort: 'popular',
      limit: 5
    });

    res.json({
      success: true,
      data: result.posts
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get single post by slug & related articles
// @route   GET /api/posts/slug/:slug
// @access  Public
async function getPostBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const post = await dataService.findPostBySlug(slug, true);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Fetch up to 3 related posts in the same category
    let relatedPosts = [];
    try {
      const related = await dataService.findPosts({
        category: post.category,
        status: 'published',
        limit: 4
      });
      relatedPosts = (related.posts || []).filter(p => (p.slug || p._id) !== slug).slice(0, 3);
    } catch (e) {
      // Non-critical
    }

    res.json({
      success: true,
      data: post,
      relatedPosts
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get single post by ID (for admin editing)
// @route   GET /api/posts/:id
// @access  Private
async function getPostById(req, res, next) {
  try {
    const post = await dataService.findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (Admin / Editor)
async function createPost(req, res, next) {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      status,
      scheduledAt,
      isFeatured,
      seo
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and category are required.'
      });
    }

    const newPost = await dataService.createPost({
      title,
      slug,
      excerpt: excerpt || title,
      content,
      coverImage,
      category,
      tags: tags || [],
      status: status || 'published',
      scheduledAt,
      isFeatured: Boolean(isFeatured),
      seo: seo || { metaTitle: title, metaDescription: excerpt },
      author: {
        name: req.user.name || 'Admin',
        avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: req.user.bio || 'Tech Editor',
        role: req.user.role || 'Admin'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: newPost
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Admin / Editor)
async function updatePost(req, res, next) {
  try {
    const post = await dataService.findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const updatedPost = await dataService.updatePost(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: updatedPost
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Admin only)
async function deletePost(req, res, next) {
  try {
    const post = await dataService.findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    await dataService.deletePost(req.params.id);

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get dashboard metrics & statistics
// @route   GET /api/posts/admin/stats
// @access  Private (Admin)
async function getAdminStats(req, res, next) {
  try {
    const stats = await dataService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

// @desc    Get all distinct tags
// @route   GET /api/posts/tags
// @access  Public
async function getAllTags(req, res, next) {
  try {
    const tags = await dataService.getAllTags();
    res.json({ success: true, data: tags });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPosts,
  getFeaturedPosts,
  getTrendingPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getAdminStats,
  getAllTags
};
