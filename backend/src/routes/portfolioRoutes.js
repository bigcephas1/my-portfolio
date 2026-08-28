import express from 'express';
import { 
  getPortfolio, 
  updatePortfolio, 
  resetPortfolio,
  getPortfolioStats,
  uploadImage
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/auth.js';
import upload from '../config/upload.js';

const router = express.Router();

// Public route
router.get('/', getPortfolio);

// Protected routes
router.use(protect);
router.put('/', updatePortfolio);
router.post('/reset', resetPortfolio);
router.get('/stats', getPortfolioStats);
router.post('/upload', upload.single('image'), uploadImage);

export default router;
