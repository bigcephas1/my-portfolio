import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  period: { type: String, required: true },
  description: { type: String, required: true }
});

const projectSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [String],
  githubUrl: String,
  liveUrl: String,
  image: String
});

const blogSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String },
  url: String,
  image: String,
  tags: [String],
  readTime: String,
  platform: String
});

const serviceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: String
});

const skillSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: Number, min: 0, max: 100 }
});

const certificationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  credentialId: String,
  credentialUrl: String,
  image: String
});

const contactFieldSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, default: 'fa-link' },
  type: { 
    type: String, 
    enum: ['email', 'phone', 'url', 'text', 'address'],
    default: 'url'
  }
});

const galleryImageSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  url: { type: String, required: true },
  alt: { type: String, default: 'Profile image' },
  order: { type: Number, default: 0 }
});

// ✅ FIXED: Make education fields optional (not required)
const educationSchema = new mongoose.Schema({
  id: { type: Number }, // Not required
  degree: { type: String },
  institution: { type: String },
  year: { type: String },
  description: { type: String, default: '' },
  certificateImage: { type: String, default: '' },
  grade: { type: String, default: '' },
  location: { type: String, default: '' }
});

const hireSchema = new mongoose.Schema({
  salaryExpectation: { type: String, required: true },
  noticePeriod: { type: String, required: true },
  availability: String,
  preferredWork: String
});

const aboutSchema = new mongoose.Schema({
  bio: { type: String, default: '' },
  experience: { type: String, default: '' },
  philosophy: { type: String, default: '' },
  interests: { type: [String], default: [] },
  profileImage: { type: String, default: '' }
});

const portfolioSchema = new mongoose.Schema({
  avatar: { type: String, default: '' },
  galleryImages: { type: [galleryImageSchema], default: [] },
  about: { type: aboutSchema, default: () => ({}) },
  intro: { type: String, default: '' },
  summary: { type: String, default: '' },
  experience: { type: [experienceSchema], default: [] },
  projects: { type: [projectSchema], default: [] },
  skills: { type: [skillSchema], default: [] },
  services: { type: [serviceSchema], default: [] },
  blog: { type: [blogSchema], default: [] },
  contactFields: { type: [contactFieldSchema], default: [] },
  certifications: { type: [certificationSchema], default: [] },
  education: { type: [educationSchema], default: [] },
  hire: { type: hireSchema, default: () => ({}) },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

portfolioSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
