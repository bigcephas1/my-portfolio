import portfolioService from '../services/portfolioService.js';
import { getImageUrl } from '../config/upload.js';

export const getPortfolio = async (req, res) => {
  try {
    const data = await portfolioService.getPortfolio();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

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

    let fileUrl;
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      // In production, Cloudinary stores the URL in req.file.path
      fileUrl = req.file.path;
      console.log('✅ Image uploaded to Cloudinary:', fileUrl);
    } else {
      // In development, build local URL
      const protocol = req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;
      fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
      console.log('✅ Image uploaded to local storage:', fileUrl);
    }
    
    const portfolio = await portfolioService.addGalleryImage(fileUrl);
    
    res.json({ 
      success: true, 
      data: { 
        url: fileUrl, 
        filename: req.file.filename || req.file.originalname,
        gallery: portfolio.galleryImages
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await portfolioService.removeGalleryImage(parseInt(id));
    res.json({ 
      success: true, 
      message: 'Image removed successfully',
      data: { gallery: portfolio.galleryImages }
    });
  } catch (error) {
    console.error('Remove image error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
