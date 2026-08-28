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

// Dynamic contact field schema - allows any field with icon and value
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

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
  description: String
});

const hireSchema = new mongoose.Schema({
  salaryExpectation: { type: String, required: true },
  noticePeriod: { type: String, required: true },
  availability: String,
  preferredWork: String
});

const aboutSchema = new mongoose.Schema({
  bio: { type: String, required: true },
  experience: { type: String },
  philosophy: String,
  interests: [String],
  profileImage: String
});

const portfolioSchema = new mongoose.Schema({
  avatar: { type: String, default: '' },
  about: aboutSchema,
  intro: { type: String, required: true },
  summary: { type: String, required: true },
  experience: [experienceSchema],
  projects: [projectSchema],
  skills: [skillSchema],
  services: [serviceSchema],
  blog: [blogSchema],
  contactFields: [contactFieldSchema],
  certifications: [certificationSchema],
  education: educationSchema,
  hire: hireSchema,
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Ensure only one document exists
portfolioSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
