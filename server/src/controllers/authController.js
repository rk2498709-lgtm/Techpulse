const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dataService = require('../services/dataService');

function generateToken(id) {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_techpulse_jwt_key_2026_change_in_production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
}

// @desc    Login Admin/User
// @route   POST /api/auth/login
// @access  Public
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await dataService.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // Check password
    let isMatch = false;
    if (typeof user.comparePassword === 'function') {
      isMatch = await user.comparePassword(password);
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    const token = generateToken(user._id || user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get Current User Profile
// @route   GET /api/auth/me
// @access  Private
async function getMe(req, res, next) {
  try {
    const user = await dataService.findUserById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Register a new editor/admin
// @route   POST /api/auth/register
// @access  Private (Admin only)
async function register(req, res, next) {
  try {
    const { name, email, password, role, bio } = req.body;

    const existing = await dataService.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.'
      });
    }

    const newUser = await dataService.createUser({
      name,
      email,
      password,
      role: role || 'editor',
      bio
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id || newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  getMe,
  register
};
