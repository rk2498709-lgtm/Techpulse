const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { categories: defaultCategories, posts: defaultPosts } = require('../data/seedData');

let isConnectedToMongo = false;

// Embedded store for local zero-dependency fallback
const LOCAL_DB_FILE = path.join(__dirname, '../data/local-db.json');

const memoryStore = {
  users: [],
  categories: [],
  posts: []
};

// Helper to save memory store to file
function persistMemoryStore() {
  try {
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local store:', err.message);
  }
}

// Load or seed initial memory store
function initializeLocalStore() {
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_FILE, 'utf-8'));
      memoryStore.users = data.users || [];
      memoryStore.categories = data.categories || [];
      memoryStore.posts = data.posts || [];
    }
  } catch (err) {
    console.warn('Could not read existing local store, re-initializing.');
  }

  // Seed default admin if missing
  if (memoryStore.users.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@123456', salt);
    memoryStore.users.push({
      _id: 'user_admin_001',
      name: process.env.ADMIN_NAME || 'Admin User',
      email: (process.env.ADMIN_EMAIL || 'admin@techpulse.io').toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      bio: 'Senior Technology Editor & Platform Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      createdAt: new Date().toISOString()
    });
  }

  // Seed default categories if missing
  if (memoryStore.categories.length === 0) {
    memoryStore.categories = defaultCategories.map((cat, idx) => ({
      _id: `cat_${idx + 1}`,
      ...cat,
      createdAt: new Date().toISOString()
    }));
  }

  // Seed default posts if missing
  if (memoryStore.posts.length === 0) {
    memoryStore.posts = defaultPosts.map((post, idx) => ({
      _id: `post_${idx + 1}`,
      ...post,
      createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  persistMemoryStore();
}

/**
 * Connect to MongoDB with automatic fallback
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techpulse_blog';

  try {
    // Attempt Mongoose connection with 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    isConnectedToMongo = true;
    console.log(`\x1b[32m✔ MongoDB connected successfully to:\x1b[0m ${uri}`);
    await autoSeedMongo();
  } catch (error) {
    isConnectedToMongo = false;
    console.log(`\x1b[33m⚠ MongoDB is not running locally (${error.message}).\x1b[0m`);
    console.log(`\x1b[36m⚡ Activating built-in JSON/Memory Database store for instant local development!\x1b[0m`);
    initializeLocalStore();
    console.log(`\x1b[32m✔ Local Store initialized with ${memoryStore.posts.length} posts & ${memoryStore.categories.length} categories.\x1b[0m`);
  }
}

/**
 * Auto seed Mongoose database if connected and empty
 */
async function autoSeedMongo() {
  try {
    const User = require('../models/User');
    const Category = require('../models/Category');
    const Post = require('../models/Post');

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@techpulse.io').toLowerCase();
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin User',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
        bio: 'Senior Technology Editor & Platform Administrator'
      });
      console.log('✔ Default Admin account created in MongoDB.');
    }

    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany(defaultCategories);
      console.log('✔ Default categories seeded in MongoDB.');
    }

    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      await Post.insertMany(defaultPosts);
      console.log('✔ Sample tech articles seeded in MongoDB.');
    }
  } catch (err) {
    console.error('Auto-seed check encountered an issue:', err.message);
  }
}

module.exports = {
  connectDB,
  isMongoActive: () => isConnectedToMongo,
  memoryStore,
  persistMemoryStore
};
