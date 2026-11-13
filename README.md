# TechPulse Technology Blog

**A complete, production-ready MERN Stack technology blog** — built with React, Node.js, Express, MongoDB, JWT authentication, and a fully responsive modern UI inspired by Zoho Blog.

---

## ✨ Feature Highlights

| Feature | Details |
|---|---|
| 📰 Homepage | Hero featured articles, trending strip, category filter, latest posts grid |
| 📋 Blog Listing | Search, category & tag filters, sort options, pagination |
| 📖 Blog Detail | Full article, code blocks with copy, Table of Contents, social sharing, related posts |
| 🔐 Admin Panel | JWT-secured dashboard with CRUD for posts, drafts, scheduling, SEO editing |
| 📂 Categories | Full category management with color themes and icon assignment |
| 🔍 Global Search | Ctrl+K modal search across all articles |
| 🛡️ Security | bcrypt password hashing, role-based access (admin/editor), protected API routes |
| 🌐 SEO | Auto sitemap.xml, robots.txt, Open Graph tags, meta keywords per post |
| 📡 Offline DB | Built-in JSON store when MongoDB is not running — works instantly with zero setup! |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+ installed
- MongoDB (optional — a built-in JSON store auto-activates if Mongo is not running)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/techpulse-blog.git
cd techpulse-blog

# Install all dependencies
npm run install:all
```

### 2. Configure Environment

```bash
# Copy the example .env to actual .env inside the server directory
cp server/.env.example server/.env
```

The default `.env` is already configured for local development. Edit `server/.env` to add your MongoDB Atlas URI or change admin credentials if desired.

### 3. Start the Backend Server

```bash
# In Terminal 1
npm run dev:server
```

✅ The server starts on `http://localhost:5000`  
✅ If MongoDB is unavailable locally, the **built-in JSON database** auto-activates with 7 sample articles and 7 categories!

### 4. Start the Frontend (React)

```bash
# In Terminal 2
npm run dev:client
```

✅ Open **http://localhost:5173** in your browser

---

## 🔐 Admin Access

Default credentials (auto-seeded):

| Field | Value |
|---|---|
| Email | `admin@techpulse.io` |
| Password | `Admin@123456` |
| Admin URL | `http://localhost:5173/admin/login` |

---

## 🗄️ Using MongoDB (Optional but Recommended for Persistence)

The blog **works out-of-the-box** without MongoDB using its built-in file-backed JSON store (all data saved to `server/src/data/local-db.json`).

To use real MongoDB:

**Option A: Local MongoDB**
1. Install [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Start `mongod` service
3. The server will auto-detect and connect to `mongodb://127.0.0.1:27017/techpulse_blog`

**Option B: MongoDB Atlas (Cloud)**
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get your connection URI
3. Set in `server/.env`:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/techpulse_blog
```

**Seed MongoDB with Sample Data**
```bash
npm run seed
```

---

## 📁 Project Structure

```
techpulse-blog/
├── server/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js        # MongoDB connector + JSON fallback store
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── categoryController.js
│   │   │   ├── postController.js
│   │   │   └── seoController.js
│   │   ├── data/
│   │   │   ├── seed.js       # MongoDB seed script
│   │   │   └── seedData.js   # Sample articles & categories
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT protect + authorize
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   └── Category.js
│   │   ├── services/
│   │   │   └── dataService.js  # Unified MongoDB/Memory service layer
│   │   ├── utils/
│   │   │   ├── slugify.js
│   │   │   └── readingTime.js
│   │   └── server.js         # Express app entry point
│   ├── .env                  # Local environment variables
│   └── .env.example          # Template for new installs
│
├── client/                  # React (Vite) Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── BlogCard.jsx
│   │   │   ├── FeaturedHero.jsx
│   │   │   ├── CategoryPills.jsx
│   │   │   ├── SearchModal.jsx
│   │   │   ├── TableOfContents.jsx
│   │   │   ├── SocialShare.jsx
│   │   │   ├── CodeBlock.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── RelatedPosts.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── BlogListPage.jsx
│   │   │   ├── BlogDetailPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminPostEditor.jsx
│   │   │   └── AdminCategoriesPage.jsx
│   │   ├── services/
│   │   │   └── api.js        # Unified fetch wrapper for all API calls
│   │   ├── App.jsx           # Routes & App Shell
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global design system CSS variables & utilities
│   └── vite.config.js        # Vite config with API proxy
│
├── .gitignore
├── package.json              # Monorepo scripts
├── vercel.json               # Vercel deployment config
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Admin login → JWT token |
| `GET` | `/api/auth/me` | Private | Get current user |
| `POST` | `/api/auth/register` | Admin | Register new editor |
| `GET` | `/api/posts` | Public | List posts (search, filter, sort, paginate) |
| `GET` | `/api/posts/featured` | Public | Get featured posts |
| `GET` | `/api/posts/trending` | Public | Get top posts by views |
| `GET` | `/api/posts/tags` | Public | Get all distinct tags |
| `GET` | `/api/posts/slug/:slug` | Public | Get post by URL slug (increments views) |
| `GET` | `/api/posts/:id` | Private | Get post by ID (admin edit) |
| `POST` | `/api/posts` | Private | Create new post |
| `PUT` | `/api/posts/:id` | Private | Update post |
| `DELETE` | `/api/posts/:id` | Admin | Delete post |
| `GET` | `/api/posts/admin/stats` | Private | Dashboard stats |
| `GET` | `/api/categories` | Public | List all categories with post count |
| `POST` | `/api/categories` | Admin | Create category |
| `PUT` | `/api/categories/:id` | Admin | Update category |
| `DELETE` | `/api/categories/:id` | Admin | Delete category |
| `GET` | `/sitemap.xml` | Public | Auto-generated XML sitemap |
| `GET` | `/robots.txt` | Public | Robots.txt with admin disallow |

---

## 🛠️ Blog Categories

1. Software Development
2. Artificial Intelligence & Machine Learning
3. Web & Mobile App Development
4. Technology & Innovation
5. Cybersecurity
6. Cloud Computing
7. Industry Insights

---

## 🚀 Deployment

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI globally
npm i -g vercel

# From the client/ directory:
cd client
vercel --prod
```

Set the following environment variable in Vercel dashboard:
- `VITE_API_URL` = your backend server URL (e.g., `https://techpulse-api.vercel.app`)

### Deploy Backend to Vercel (Serverless)

The included `vercel.json` configures the Node.js backend as serverless functions.

```bash
# From root directory:
vercel --prod
```

**Required Vercel environment variables:**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

---

## 🔧 Google Analytics & Search Console

- **Google Analytics**: Replace `G-TECHPULSE` with your real Measurement ID in `client/index.html`
- **Search Console**: Replace the verification token in the `<meta name="google-site-verification">` tag in `client/index.html`

---

## 🛡️ Security Features

- Passwords hashed with **bcryptjs** (10 rounds)
- **JWT tokens** expire after 7 days (configurable)
- All `/api/posts` write operations require a valid Bearer token
- Delete operations restricted to `admin` role only
- CORS configured to allow only the specified `CLIENT_URL`
- Admin panel routes blocked in `robots.txt`

---

## 📝 License

MIT License — Free to use, modify, and deploy.
