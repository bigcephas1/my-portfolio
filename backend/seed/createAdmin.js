// seed/createAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../src/models/Admin.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      email: process.env.ADMIN_EMAIL || 'admin@yourdomain.com' 
    });

    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      password: process.env.ADMIN_PASSWORD || 'SecurePassword123!',
      name: 'Administrator',
      role: 'superadmin'
    });

    console.log('✅ Admin created successfully!');
    console.log(`📧 Email: ${admin.email}`);
    console.log('🔑 Password: [hidden]');
    console.log('⚠️  Please change password after first login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
