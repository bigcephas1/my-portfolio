import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_images',
    allowed_formats: ['jpg', 'png', 'gif', 'webp', 'jpeg', 'pdf'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
    resource_type: 'auto'
  }
});

const uploadCloudinary = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export default uploadCloudinary;
