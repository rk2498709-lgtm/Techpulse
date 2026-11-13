const dataService = require('../services/dataService');

// @desc    Get all categories with post count
// @route   GET /api/categories
// @access  Public
async function getCategories(req, res, next) {
  try {
    const categories = await dataService.findCategories();
    const postsResult = await dataService.findPosts({ status: 'published', limit: 1000 });
    const posts = postsResult.posts || [];

    // Attach post count to each category
    const categoriesWithCount = categories.map(cat => {
      const count = posts.filter(
        p => p.category && p.category.toLowerCase() === cat.name.toLowerCase()
      ).length;
      return {
        ...(cat.toObject ? cat.toObject() : cat),
        postCount: count
      };
    });

    res.json({
      success: true,
      data: categoriesWithCount
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
async function createCategory(req, res, next) {
  try {
    const { name, slug, description, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const newCategory = await dataService.createCategory({
      name,
      slug,
      description,
      color: color || '#2563EB',
      icon: icon || 'folder'
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
async function updateCategory(req, res, next) {
  try {
    const updated = await dataService.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
async function deleteCategory(req, res, next) {
  try {
    const deleted = await dataService.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
