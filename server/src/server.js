const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { protect, authorize } = require('./middleware/authMiddleware');

// Controllers
const authController = require('./controllers/authController');
const postController = require('./controllers/postController');
const categoryController = require('./controllers/categoryController');
const seoController = require('./controllers/seoController');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure database connection for both serverless and standalone
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in middleware:', err.message);
  }
  next();
});

// SEO Endpoints at root level
app.get('/sitemap.xml', seoController.getSitemapXml);
app.get('/robots.txt', seoController.getRobotsTxt);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'TechPulse Technology Blog API'
  });
});

// Authentication Routes
const authRouter = express.Router();
authRouter.post('/login', authController.login);
authRouter.get('/me', protect, authController.getMe);
authRouter.post('/register', protect, authorize('admin'), authController.register);
app.use('/api/auth', authRouter);

// Posts Routes
const postRouter = express.Router();
postRouter.get('/', postController.getPosts);
postRouter.get('/featured', postController.getFeaturedPosts);
postRouter.get('/trending', postController.getTrendingPosts);
postRouter.get('/tags', postController.getAllTags);
postRouter.get('/slug/:slug', postController.getPostBySlug);
postRouter.get('/admin/stats', protect, postController.getAdminStats);
postRouter.get('/:id', protect, postController.getPostById);
postRouter.post('/', protect, postController.createPost);
postRouter.put('/:id', protect, postController.updatePost);
postRouter.delete('/:id', protect, authorize('admin'), postController.deletePost);
app.use('/api/posts', postRouter);

// Categories Routes
const categoryRouter = express.Router();
categoryRouter.get('/', categoryController.getCategories);
categoryRouter.post('/', protect, authorize('admin'), categoryController.createCategory);
categoryRouter.put('/:id', protect, authorize('admin'), categoryController.updateCategory);
categoryRouter.delete('/:id', protect, authorize('admin'), categoryController.deleteCategory);
app.use('/api/categories', categoryRouter);

// 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start standalone HTTP server when not running in serverless (Vercel)
if (process.env.VERCEL !== '1') {
  connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n======================================================`);
      console.log(`🚀 TechPulse Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`🔗 API Direct: http://127.0.0.1:${PORT}/api`);
      console.log(`📄 Sitemap:  http://localhost:${PORT}/sitemap.xml`);
      console.log(`🤖 Robots:   http://localhost:${PORT}/robots.txt`);
      console.log(`======================================================\n`);
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
  });
}

module.exports = app;
