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
  origin: [
    'http://localhost:5173',
    'https://techpulse-54bgfaksj-rk2498709-4722.vercel.app/'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Initialize Database connection then start server
const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(console.error);
} else {
  connectDB().catch(console.error);
}

module.exports = app;
}).catch (err => {
  console.error('Failed to start server:', err);
});

module.exports = app;
