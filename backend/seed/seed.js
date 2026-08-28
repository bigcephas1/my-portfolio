import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Portfolio from '../src/models/Portfolio.js';
import { defaultPortfolioData } from './defaultData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if data already exists
    const existing = await Portfolio.findOne();
    
    if (existing) {
      console.log('📊 Data already exists in database. Skipping seed.');
      console.log('📌 To reset, delete the collection and run seed again.');
      process.exit(0);
    }

    // Insert default data only if empty
    const portfolio = await Portfolio.create(defaultPortfolioData);
    console.log('✅ Default portfolio data seeded successfully!');
    console.log(`📊 Portfolio ID: ${portfolio._id}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
