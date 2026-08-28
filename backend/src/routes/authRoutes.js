// src/routes/authRoutes.js
import express from 'express';
import {
  login,
  logout,
  getMe,
  refreshToken,
  updatePassword,
  updateProfile,
  getAdmins,
  createAdmin,
  deleteAdmin
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import { 
  validateLogin, 
  validatePasswordUpdate, 
  validateAdminCreation 
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);

// Private routes (require authentication)
router.use(protect);

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/update-password', validatePasswordUpdate, updatePassword);
router.put('/update-profile', updateProfile);

// Superadmin only routes
router.get('/admins', authorize('superadmin'), getAdmins);
router.post('/admin', authorize('superadmin'), validateAdminCreation, createAdmin);
router.delete('/admin/:id', authorize('superadmin'), deleteAdmin);

export default router;
