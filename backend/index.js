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

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://yourdomain.com'
    ];

    app.use(cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());

    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

    // Request logging
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
      next();
    });

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/portfolio', portfolioRoutes);
    app.use('/api/contact', contactRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected'
      });
    });

    // Static files in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../frontend/out')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/out/index.html'));
      });
    }

    // Error handling
    app.use(notFoundHandler);
    app.use(errorHandler);

    // Start server
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
