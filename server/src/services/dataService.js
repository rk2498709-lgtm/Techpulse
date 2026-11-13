const { isMongoActive, memoryStore, persistMemoryStore } = require('../config/db');
const User = require('../models/User');
const Post = require('../models/Post');
const Category = require('../models/Category');
const slugify = require('../utils/slugify');
const calculateReadingTime = require('../utils/readingTime');

const dataService = {
  // ================= USERS =================
  async findUserByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoActive()) {
      return await User.findOne({ email: cleanEmail }).select('+password');
    }
    return memoryStore.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findUserById(id) {
    if (isMongoActive()) {
      return await User.findById(id).select('-password');
    }
    const user = memoryStore.users.find(u => u._id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async createUser(userData) {
    if (isMongoActive()) {
      return await User.create(userData);
    }
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    const newUser = {
      _id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: bcrypt.hashSync(userData.password, salt),
      role: userData.role || 'editor',
      bio: userData.bio || '',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      createdAt: new Date().toISOString()
    };
    memoryStore.users.push(newUser);
    persistMemoryStore();
    const { password, ...safeUser } = newUser;
    return safeUser;
  },

  // ================= POSTS =================
  async findPosts({
    category,
    tag,
    search,
    status = 'published',
    isFeatured,
    sort = 'newest',
    page = 1,
    limit = 9
  } = {}) {
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.max(1, parseInt(limit, 10) || 9);

    if (isMongoActive()) {
      const query = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (category && category !== 'All') {
        query.category = new RegExp(`^${category}$`, 'i');
      }
      if (tag) {
        query.tags = { $in: [new RegExp(tag, 'i')] };
      }
      if (isFeatured !== undefined && isFeatured !== null) {
        query.isFeatured = isFeatured === true || isFeatured === 'true';
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: regex },
          { excerpt: regex },
          { content: regex },
          { tags: { $in: [regex] } }
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'oldest') sortOption = { createdAt: 1 };
      if (sort === 'popular' || sort === 'views') sortOption = { views: -1 };
      if (sort === 'title') sortOption = { title: 1 };

      const totalPosts = await Post.countDocuments(query);
      const posts = await Post.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        posts,
        page,
        limit,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts
      };
    }

    // In-Memory Fallback Implementation
    let filtered = [...memoryStore.posts];

    if (status && status !== 'all') {
      filtered = filtered.filter(p => (p.status || 'published') === status);
    }
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }
    if (tag) {
      filtered = filtered.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }
    if (isFeatured !== undefined && isFeatured !== null) {
      const targetFeatured = isFeatured === true || isFeatured === 'true';
      filtered = filtered.filter(p => Boolean(p.isFeatured) === targetFeatured);
    }
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      filtered = filtered.filter(p =>
        (p.title && p.title.toLowerCase().includes(term)) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(term)) ||
        (p.content && p.content.toLowerCase().includes(term)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(term)))
      );
    }

    // Sort
    if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'popular' || sort === 'views') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sort === 'title') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else {
      // default newest
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const totalPosts = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedPosts = filtered.slice(startIndex, startIndex + limit);

    return {
      posts: paginatedPosts,
      page,
      limit,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    };
  },

  async findPostBySlug(slug, incrementView = false) {
    if (isMongoActive()) {
      const update = incrementView ? { $inc: { views: 1 } } : {};
      const post = await Post.findOneAndUpdate({ slug }, update, { new: true });
      return post;
    }

    const post = memoryStore.posts.find(p => p.slug === slug);
    if (post && incrementView) {
      post.views = (post.views || 0) + 1;
      persistMemoryStore();
    }
    return post || null;
  },

  async findPostById(id) {
    if (isMongoActive()) {
      return await Post.findById(id);
    }
    return memoryStore.posts.find(p => p._id === id || p.id === id) || null;
  },

  async createPost(postData) {
    // Generate slug if not present
    let finalSlug = postData.slug ? slugify(postData.slug) : slugify(postData.title);
    const readingTime = calculateReadingTime(postData.content);

    if (isMongoActive()) {
      // Ensure unique slug
      let uniqueSlug = finalSlug;
      let counter = 1;
      while (await Post.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${finalSlug}-${counter++}`;
      }
      return await Post.create({
        ...postData,
        slug: uniqueSlug,
        readingTime
      });
    }

    // Ensure unique slug in memory
    let uniqueSlug = finalSlug;
    let counter = 1;
    while (memoryStore.posts.some(p => p.slug === uniqueSlug)) {
      uniqueSlug = `${finalSlug}-${counter++}`;
    }

    const newPost = {
      _id: `post_${Date.now()}`,
      title: postData.title,
      slug: uniqueSlug,
      excerpt: postData.excerpt,
      content: postData.content,
      coverImage: postData.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      category: postData.category,
      tags: Array.isArray(postData.tags) ? postData.tags : (postData.tags ? postData.tags.split(',').map(t => t.trim()) : []),
      author: postData.author || {
        name: 'TechPulse Editorial',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: 'Senior Tech Editor & Systems Architect',
        role: 'Staff Writer'
      },
      status: postData.status || 'published',
      scheduledAt: postData.scheduledAt ? new Date(postData.scheduledAt).toISOString() : null,
      isFeatured: Boolean(postData.isFeatured),
      views: 0,
      readingTime,
      seo: postData.seo || {
        metaTitle: postData.title,
        metaDescription: postData.excerpt,
        metaKeywords: postData.tags || []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryStore.posts.unshift(newPost);
    persistMemoryStore();
    return newPost;
  },

  async updatePost(id, updateData) {
    if (updateData.title && !updateData.slug) {
      updateData.slug = slugify(updateData.title);
    }
    if (updateData.content) {
      updateData.readingTime = calculateReadingTime(updateData.content);
    }
    updateData.updatedAt = new Date().toISOString();

    if (isMongoActive()) {
      return await Post.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    const index = memoryStore.posts.findIndex(p => p._id === id || p.id === id);
    if (index === -1) return null;

    memoryStore.posts[index] = {
      ...memoryStore.posts[index],
      ...updateData
    };
    persistMemoryStore();
    return memoryStore.posts[index];
  },

  async deletePost(id) {
    if (isMongoActive()) {
      return await Post.findByIdAndDelete(id);
    }

    const index = memoryStore.posts.findIndex(p => p._id === id || p.id === id);
    if (index === -1) return null;
    const deleted = memoryStore.posts.splice(index, 1);
    persistMemoryStore();
    return deleted[0];
  },

  // ================= CATEGORIES =================
  async findCategories() {
    if (isMongoActive()) {
      return await Category.find().sort({ name: 1 });
    }
    return [...memoryStore.categories].sort((a, b) => a.name.localeCompare(b.name));
  },

  async createCategory(catData) {
    const slug = catData.slug ? slugify(catData.slug) : slugify(catData.name);
    if (isMongoActive()) {
      return await Category.create({ ...catData, slug });
    }

    const newCat = {
      _id: `cat_${Date.now()}`,
      name: catData.name,
      slug,
      description: catData.description || '',
      color: catData.color || '#2563EB',
      icon: catData.icon || 'folder',
      createdAt: new Date().toISOString()
    };
    memoryStore.categories.push(newCat);
    persistMemoryStore();
    return newCat;
  },

  async updateCategory(id, updateData) {
    if (updateData.name && !updateData.slug) {
      updateData.slug = slugify(updateData.name);
    }
    if (isMongoActive()) {
      return await Category.findByIdAndUpdate(id, updateData, { new: true });
    }

    const index = memoryStore.categories.findIndex(c => c._id === id || c.id === id);
    if (index === -1) return null;
    memoryStore.categories[index] = { ...memoryStore.categories[index], ...updateData };
    persistMemoryStore();
    return memoryStore.categories[index];
  },

  async deleteCategory(id) {
    if (isMongoActive()) {
      return await Category.findByIdAndDelete(id);
    }

    const index = memoryStore.categories.findIndex(c => c._id === id || c.id === id);
    if (index === -1) return null;
    const deleted = memoryStore.categories.splice(index, 1);
    persistMemoryStore();
    return deleted[0];
  },

  // ================= STATS & AGGREGATIONS =================
  async getStats() {
    if (isMongoActive()) {
      const totalPosts = await Post.countDocuments();
      const publishedPosts = await Post.countDocuments({ status: 'published' });
      const draftPosts = await Post.countDocuments({ status: 'draft' });
      const scheduledPosts = await Post.countDocuments({ status: 'scheduled' });
      const totalCategories = await Category.countDocuments();

      const viewsResult = await Post.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]);
      const totalViews = viewsResult[0] ? viewsResult[0].totalViews : 0;

      return {
        totalPosts,
        publishedPosts,
        draftPosts,
        scheduledPosts,
        totalCategories,
        totalViews
      };
    }

    const totalPosts = memoryStore.posts.length;
    const publishedPosts = memoryStore.posts.filter(p => p.status === 'published').length;
    const draftPosts = memoryStore.posts.filter(p => p.status === 'draft').length;
    const scheduledPosts = memoryStore.posts.filter(p => p.status === 'scheduled').length;
    const totalCategories = memoryStore.categories.length;
    const totalViews = memoryStore.posts.reduce((acc, p) => acc + (p.views || 0), 0);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      scheduledPosts,
      totalCategories,
      totalViews
    };
  },

  async getAllTags() {
    if (isMongoActive()) {
      const posts = await Post.find({}, 'tags');
      const tagSet = new Set();
      posts.forEach(p => {
        if (p.tags && Array.isArray(p.tags)) {
          p.tags.forEach(t => tagSet.add(t));
        }
      });
      return Array.from(tagSet);
    }

    const tagSet = new Set();
    memoryStore.posts.forEach(p => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach(t => tagSet.add(t));
      }
    });
    return Array.from(tagSet);
  }
};

module.exports = dataService;
