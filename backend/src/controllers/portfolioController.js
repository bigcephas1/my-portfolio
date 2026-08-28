import portfolioService from '../services/portfolioService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Public route
export const getPortfolio = async (req, res) => {
  try {
    const data = await portfolioService.getPortfolio();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Protected routes
export const updatePortfolio = async (req, res) => {
  try {
    const updatedData = await portfolioService.updatePortfolio(req.body);
    res.json({ success: true, data: updatedData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const resetPortfolio = async (req, res) => {
  try {
    const data = await portfolioService.resetToDefault();
    res.json({ success: true, data, message: 'Reset to default data' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPortfolioStats = async (req, res) => {
  try {
    const stats = await portfolioService.getPortfolioStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Get the uploaded file URL
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      data: { url: fileUrl, filename: req.file.filename }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
