import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine which storage to use based on environment
const isProduction = process.env.NODE_ENV === 'production';

// Local storage configuration (development)
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, SVG, and PDF are allowed.'), false);
  }
};

// Local multer instance
const localUpload = multer({
  storage: localStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Cloudinary upload (will be imported conditionally)
let cloudinaryUpload = null;
let cloudinaryInstance = null;

if (isProduction) {
  try {
    const { CloudinaryStorage } = await import('multer-storage-cloudinary');
    const cloudinary = (await import('./cloudinary.js')).default;
    
    cloudinaryInstance = cloudinary;
    
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'portfolio_images',
        allowed_formats: ['jpg', 'png', 'gif', 'webp', 'jpeg', 'pdf'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
        resource_type: 'auto'
      }
    });
    
    cloudinaryUpload = multer({
      storage: storage,
      limits: {
        fileSize: 10 * 1024 * 1024
      },
      fileFilter: fileFilter
    });
    
    console.log('✅ Cloudinary storage configured for production');
  } catch (error) {
    console.error('❌ Failed to load Cloudinary:', error.message);
    console.log('⚠️ Falling back to local storage');
    cloudinaryUpload = localUpload;
  }
}

// Export the appropriate upload middleware
export const upload = isProduction && cloudinaryUpload ? cloudinaryUpload : localUpload;

// Export cloudinary instance for direct use if needed
export const cloudinary = cloudinaryInstance;

// Export a function to get the image URL based on environment
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (Cloudinary), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // In production with Cloudinary, images should be full URLs
  if (isProduction) {
    // If somehow we have a local path in production, try to convert it
    // This is a fallback - ideally all images in production are Cloudinary URLs
    console.warn('⚠️ Local image path found in production:', imagePath);
    return imagePath;
  }
  
  // In development, prepend the local server URL
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  if (imagePath.startsWith('/uploads')) {
    return `${baseUrl}${imagePath}`;
  }
  return imagePath;
};

// Export a function to delete an image from Cloudinary (production only)
export const deleteImage = async (imageUrl) => {
  if (!isProduction || !cloudinaryInstance) {
    console.log('⚠️ Delete image only available in production with Cloudinary');
    return;
  }
  
  try {
    // Extract public_id from Cloudinary URL
    // Example: https://res.cloudinary.com/cloud_name/image/upload/v123456/portfolio_images/image.jpg
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = `portfolio_images/${filename.split('.')[0]}`;
    
    const result = await cloudinaryInstance.uploader.destroy(publicId);
    console.log('✅ Image deleted from Cloudinary:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to delete image from Cloudinary:', error);
  }
};

export default upload;
