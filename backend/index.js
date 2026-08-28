import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/database.js';
import portfolioRoutes from './src/routes/portfolioRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:", "http://localhost:5000", "https://res.cloudinary.com"],
        },
      },
    }));

    // ✅ CORS for Render
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://your-frontend-url.onrender.com',
      'http://localhost:3000'
    ];

    app.use(cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin?.includes('.onrender.com')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());

    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

    app.use((req, res, next) => {
      console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
      next();
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/portfolio', portfolioRoutes);
    app.use('/api/contact', contactRoutes);

    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected'
      });
    });

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📧 Email service: Brevo (Sendinblue)`);
      console.log(`🗄️  Database: MongoDB`);
      console.log(`🔐 JWT Authentication: Enabled`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`📁 Uploads: ${path.join(__dirname, 'src/uploads')}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
