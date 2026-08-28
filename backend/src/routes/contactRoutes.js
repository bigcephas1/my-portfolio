import express from 'express';
import { 
  sendContactEmail, 
  getContacts, 
  updateContactStatus,
  getContactById,
  deleteContact,
  getContactStats
} from '../controllers/contactController.js';
import { validateContact } from '../middleware/validation.js';
import { protect } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Public route - Rate limited
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: 'Too many contact requests. Please try again later.'
  }
});

router.post('/', contactLimiter, validateContact, sendContactEmail);

// Protected routes
router.use(protect);
router.get('/', getContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContactById);
router.put('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

export default router;
