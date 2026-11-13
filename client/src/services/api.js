const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Universal request wrapper
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('techpulse_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authAPI = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  getMe: () => request('/auth/me'),
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
};

export const postsAPI = {
  getPosts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const queryString = searchParams.toString();
    return request(`/posts${queryString ? `?${queryString}` : ''}`);
  },
  getFeatured: () => request('/posts/featured'),
  getTrending: () => request('/posts/trending'),
  getPostBySlug: (slug) => request(`/posts/slug/${slug}`),
  getPostById: (id) => request(`/posts/${id}`),
  createPost: (postData) =>
    request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    }),
  updatePost: (id, postData) =>
    request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData)
    }),
  deletePost: (id) =>
    request(`/posts/${id}`, {
      method: 'DELETE'
    }),
  getStats: () => request('/posts/admin/stats'),
  getTags: () => request('/posts/tags')
};

export const categoriesAPI = {
  getCategories: () => request('/categories'),
  createCategory: (catData) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify(catData)
    }),
  updateCategory: (id, catData) =>
    request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(catData)
    }),
  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: 'DELETE'
    })
};
