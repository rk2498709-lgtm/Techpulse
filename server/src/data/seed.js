const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Post = require('../models/Post');
const { categories, posts } = require('./seedData');

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techpulse_blog';

  try {
    console.log('Connecting to database:', uri);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected! Purging and resetting data...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Post.deleteMany({});

    // Create Admin
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin User',
      email: (process.env.ADMIN_EMAIL || 'admin@techpulse.io').toLowerCase(),
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      bio: 'Senior Technology Editor & Platform Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    });
    console.log('✔ Admin user created: admin@techpulse.io / Admin@123456');

    // Insert categories
    await Category.insertMany(categories);
    console.log(`✔ Inserted ${categories.length} categories.`);

    // Insert posts
    await Post.insertMany(posts);
    console.log(`✔ Inserted ${posts.length} rich sample posts.`);

    console.log('\n🎉 Database seeding completed successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seedDatabase();
