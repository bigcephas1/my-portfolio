
## README.md

```bash

# 🚀 Peter Uchenna Ukpabi - Professional Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Brevo](https://img.shields.io/badge/Brevo-0B996E?style=for-the-badge&logo=sendinblue&logoColor=white)](https://www.brevo.com/)

A full-stack, production-ready portfolio application for DevSecOps professionals with dynamic content management, image gallery, and automated email handling.

## ✨ Features

### 🌐 Public Frontend
- **Modern UI/UX** - Clean, responsive design with dark/light mode toggle
- **Image Carousel** - Auto-rotating gallery with navigation controls
- **Dynamic Content** - All content editable via admin dashboard
- **Blog System** - Full CRUD with external links and social sharing
- **Project Showcase** - Display projects with tech stacks and live links
- **Skill Categories** - Organized skills with proficiency levels
- **Certification Display** - Showcase certificates with image uploads
- **Contact Form** - Integrated with Brevo email service
- **Social Media Integration** - Dynamic social links with Font Awesome icons

### 🔐 Admin Dashboard
- **Secure Authentication** - JWT-based login with refresh tokens
- **Full Content Management** - Edit all portfolio sections
- **Image Gallery Management** - Upload, preview, and delete images
- **Message Inbox** - View and manage contact form submissions
- **Real-time Updates** - Changes saved instantly to MongoDB
- **Role-Based Access** - Admin and Superadmin roles
- **Activity Logging** - Track failed login attempts and lockouts

### 🛠️ Technical Features
- **Next.js 14 App Router** - Server components, optimized routing
- **MongoDB Atlas** - Cloud database with Mongoose ODM
- **JWT Authentication** - Secure with refresh tokens
- **Cloudinary Integration** - Image storage and optimization
- **Brevo Email Service** - Reliable email delivery with auto-reply
- **Dark/Light Mode** - Persistent theme preference
- **Responsive Design** - Mobile-first approach
- **Type-Safe** - Using JavaScript with comprehensive error handling

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Public  │  │  Admin   │  │  Shared  │  │  Context │  │
│  │  Routes  │  │  Routes  │  │   Auth   │  │ Provider │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (Express.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Auth   │  │Portfolio │  │  Contact │  │  Email   │  │
│  │  Routes  │  │  Routes  │  │  Routes  │  │ Service  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                         Databases                          │
│  ┌──────────┐                    ┌──────────┐            │
│  │ MongoDB  │                    │ Cloudinary│            │
│  │  Atlas   │                    │ Storage  │            │
│  └──────────┘                    └──────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
my-portfolio/
├── frontend/
│   ├── app/
│   │   ├── (admin)/          # Admin routes (dashboard, login)
│   │   ├── (public)/         # Public routes (home, about, projects, etc.)
│   │   ├── admin/            # Admin page components
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # React context providers
│   │   ├── styles/           # Global CSS and theme
│   │   ├── layout.jsx        # Root layout
│   │   └── page.jsx          # Home page
│   ├── public/               # Static assets
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── utils/            # Utility functions
│   ├── seed/                 # Database seed files
│   ├── uploads/              # Local image storage (dev)
│   └── index.js              # Server entry point
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for production)
- Brevo API key (for email)

### Installation

```bash
# Clone the repository
git clone https://github.com/bigcephas1/portfolio.git
cd portfolio

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

Create `.env` files:

**Backend (`backend/.env`):**
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!

# Brevo Email
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=sender@yourdomain.com
BREVO_SENDER_NAME=Your Name
BREVO_REPLY_TO=reply@yourdomain.com

# Cloudinary (optional for development)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMAGE_URL=http://localhost:5000
```

### Run Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open http://localhost:3000

### Create Admin User

```bash
cd backend
npm run create-admin
```

### Seed Database

```bash
cd backend
npm run seed
```

## 🔧 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-password` | Update password |
| PUT | `/api/auth/update-profile` | Update profile |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get portfolio data |
| PUT | `/api/portfolio` | Update portfolio |
| POST | `/api/portfolio/upload` | Upload image |
| DELETE | `/api/portfolio/gallery/:id` | Remove gallery image |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Send contact message |
| GET | `/api/contact` | Get messages (admin) |
| PUT | `/api/contact/:id/status` | Update message status |

## 📦 Deployment

### Deploy to Render

1. **Backend**
```bash
# Create render.yaml
services:
  - type: web
    name: portfolio-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: your_mongodb_atlas_uri
      # ... other env vars
```

2. **Frontend**
```bash
# Build for production
cd frontend
npm run build
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

## 🔒 Security Features

- **JWT Authentication** with refresh token rotation
- **Password Hashing** using bcrypt
- **Account Lockout** after 5 failed attempts
- **HTTP-only Cookies** for token storage
- **CORS Protection** with allowed origins
- **Helmet.js** for security headers
- **Rate Limiting** for login and contact forms
- **Input Validation** and sanitization
- **Environment Variables** for sensitive data

## 🎨 Tech Stack

### Frontend
- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Axios](https://axios-http.com/) - HTTP client
- [React Hot Toast](https://react-hot-toast.com/) - Notifications
- [Font Awesome](https://fontawesome.com/) - Icons

### Backend
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - ODM
- [JWT](https://jwt.io/) - Authentication
- [Multer](https://github.com/expressjs/multer) - File upload
- [Cloudinary](https://cloudinary.com/) - Image storage
- [Brevo](https://www.brevo.com/) - Email service

## 🌟 Future Improvements

- [ ] Add comments system for blog posts
- [ ] Implement analytics dashboard
- [ ] Add newsletter subscription
- [ ] Create mobile app using React Native
- [ ] Add portfolio analytics
- [ ] Implement CI/CD pipeline
- [ ] Add unit and integration tests
- [ ] Implement WebSocket for real-time updates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Peter Uchenna Ukpabi - [ukpabipeteru@gmail.com](mailto:ukpabipeteru@gmail.com)

Project Link: [https://github.com/bigcephas1/portfolio](https://github.com/bigcephas1/my-portfolio)

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Brevo Documentation](https://developers.brevo.com/)

---

⭐️ Don't forget to star this repo if you find it useful!

```

## Additional Files for Repository

### .gitignore

```bash

# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build outputs
.next/
out/
dist/
build/

# Environment files
.env
.env.local
.env.*.local

# Backend uploads
backend/uploads/
backend/src/uploads/

# Database
*.db
*.sqlite

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Testing
coverage/
.nyc_output/

# Temp files
tmp/
temp/

# Production files
*.tar.gz
*.zip

```

## Git Commands to Push to Repository

```bash
cd ~/my-portfolio

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Professional portfolio with admin dashboard"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/bigcephas1/my-portfolio.git

# Push to main branch
git push -u origin main
```


