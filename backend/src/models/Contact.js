// src/models/Contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  subject: { 
    type: String, 
    default: '',
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: { 
    type: String, 
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  ip: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  repliedAt: { 
    type: Date 
  },
  notes: { 
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for faster queries
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1, status: 1 });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
