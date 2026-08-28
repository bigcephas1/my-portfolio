import express from 'express';
import { 
  getPortfolio, 
  updatePortfolio, 
  resetPortfolio,
  getPortfolioStats,
  uploadImage,
  removeGalleryImage
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/upload.js';

const router = express.Router();

// Public route
router.get('/', getPortfolio);

// Protected routes
router.use(protect);
router.put('/', updatePortfolio);
router.post('/reset', resetPortfolio);
router.get('/stats', getPortfolioStats);

// Upload route - uses the conditional upload middleware
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/gallery/:id', removeGalleryImage);

export default router;
