const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an article title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide a short excerpt'],
      trim: true,
      maxlength: [400, 'Excerpt cannot exceed 400 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide article content']
    },
    coverImage: {
      type: String,
      required: [true, 'Please provide a cover image URL'],
      default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
      index: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    author: {
      name: { type: String, default: 'TechPulse Editorial' },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      bio: { type: String, default: 'Senior Tech Editor & Systems Architect' },
      role: { type: String, default: 'Staff Writer' }
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'scheduled'],
      default: 'published',
      index: true
    },
    scheduledAt: {
      type: Date,
      default: null
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    views: {
      type: Number,
      default: 0
    },
    readingTime: {
      type: Number,
      default: 5
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: [{ type: String }],
      canonicalUrl: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

// Add full text index for search
postSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);
