// src/controllers/authController.js
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { validateEmail } from '../utils/validators.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Set token in HTTP-only cookie
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email'
      });
    }

    // Find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      const lockTime = Math.ceil((admin.lockUntil - Date.now()) / (60 * 1000));
      return res.status(401).json({
        success: false,
        error: `Account is locked. Please try again in ${lockTime} minutes`
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact support'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      await admin.incrementFailedAttempts();
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Reset failed attempts on successful login
    await admin.resetFailedAttempts();

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate tokens
    const token = generateToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    // Save refresh token
    admin.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    await admin.save();

    // Set HTTP-only cookie
    setTokenCookie(res, token);

    // Return user data (excluding sensitive info)
    const adminData = {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      lastLogin: admin.lastLogin
    };

    res.json({
      success: true,
      data: {
        user: adminData,
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    });
  }
};

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // Remove refresh token from database
    if (req.admin) {
      await Admin.findByIdAndUpdate(req.admin.id, {
        $pull: { refreshTokens: { token: req.body.refreshToken } }
      });
    }

    // Clear cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password -refreshTokens');
    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public (with refresh token)
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Check if refresh token exists in database
    const tokenExists = admin.refreshTokens.some(
      t => t.token === refreshToken && t.expiresAt > new Date()
    );

    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      });
    }

    // Generate new token
    const newToken = generateToken(admin._id);
    setTokenCookie(res, newToken);

    res.json({
      success: true,
      data: { token: newToken }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters'
      });
    }

    const admin = await Admin.findById(req.admin.id);
    const isPasswordValid = await admin.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update password'
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }
      // Check if email is taken by another admin
      const existingAdmin = await Admin.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.admin.id }
      });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use'
        });
      }
      updates.email = email.toLowerCase();
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
};

// @desc    Get all admins (superadmin only)
// @route   GET /api/auth/admins
// @access  Private (superadmin only)
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select('-password -refreshTokens')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch admins'
    });
  }
};

// @desc    Create admin (superadmin only)
// @route   POST /api/auth/admin
// @access  Private (superadmin only)
export const createAdmin = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email, password, and name'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Admin already exists with this email'
      });
    }

    // Create admin
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password,
      name,
      role: role || 'admin'
    });

    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create admin'
    });
  }
};

// @desc    Delete admin (superadmin only)
// @route   DELETE /api/auth/admin/:id
// @access  Private (superadmin only)
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting own account
    if (id === req.admin.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete admin'
    });
  }
};
