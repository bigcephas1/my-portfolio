// seed/seed.js
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
    console.log('Connected to MongoDB');

    // Delete existing data
    await Portfolio.deleteMany({});
    console.log('Cleared existing portfolio data');

    // Insert default data
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
