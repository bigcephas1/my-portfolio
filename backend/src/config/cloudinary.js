import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Only configure Cloudinary if we're in production and have credentials
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log('✅ Cloudinary configured for production');
} else if (!isProduction) {
  console.log('📁 Using local filesystem storage for development');
} else {
  console.warn('⚠️ Cloudinary credentials missing - using local storage');
}

export default cloudinary;
