// src/middleware/validation.js
import { validateContactForm, sanitizeInput, validateEmail } from '../utils/validators.js';

export const validateContact = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  
  // Sanitize inputs
  req.body.name = sanitizeInput(name);
  req.body.email = sanitizeInput(email);
  req.body.subject = subject ? sanitizeInput(subject) : '';
  req.body.message = sanitizeInput(message);
  
  const validation = validateContactForm(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors
    });
  }
  
  // Add IP to request for logging
  req.body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
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
  
  req.body.email = sanitizeInput(email);
  req.body.password = sanitizeInput(password);
  
  next();
};

export const validatePasswordUpdate = (req, res, next) => {
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
  
  next();
};

export const validateAdminCreation = (req, res, next) => {
  const { email, password, name } = req.body;
  
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
  
  req.body.email = sanitizeInput(email);
  req.body.name = sanitizeInput(name);
  
  next();
};
