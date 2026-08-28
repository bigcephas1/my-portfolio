'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const ContactPage = ({ data }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const contactFields = data.contactFields || [];
  const education = data.education || {};
  const certifications = data.certifications || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/contact`, formData);
      if (res.data.success) {
        toast.success('✅ Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.response?.data?.error || '❌ Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to render contact field based on type
  const renderContactField = (field) => {
    const iconClass = field.icon.startsWith('fa-') ? field.icon : `fa-${field.icon}`;
    const isFab = ['fa-github', 'fa-linkedin', 'fa-twitter', 'fa-youtube', 'fa-instagram', 
                   'fa-facebook', 'fa-tiktok', 'fa-twitch', 'fa-discord', 'fa-reddit', 
                   'fa-medium', 'fa-dev', 'fa-hashnode'].includes(iconClass);
    const iconTag = isFab ? 'fab' : 'fas';

    switch (field.type) {
      case 'email':
        return (
          <p key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
            <i className={`${iconTag} ${iconClass}`} style={{ color: '#2563eb', width: '20px' }}></i>
            <a href={`mailto:${field.value}`} style={{ color: 'var(--text-color)', textDecoration: 'none' }}>
              {field.value}
            </a>
          </p>
        );
      case 'phone':
        return (
          <p key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
            <i className={`${iconTag} ${iconClass}`} style={{ color: '#2563eb', width: '20px' }}></i>
            <a href={`tel:${field.value}`} style={{ color: 'var(--text-color)', textDecoration: 'none' }}>
              {field.value}
            </a>
          </p>
        );
      case 'url':
        const href = field.value.startsWith('http') ? field.value : `https://${field.value}`;
        return (
          <p key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
            <i className={`${iconTag} ${iconClass}`} style={{ color: '#2563eb', width: '20px' }}></i>
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>
              {field.label}: {field.value}
              <i className="fas fa-external-link-alt" style={{ fontSize: '0.7rem', marginLeft: '0.3rem', color: '#64748b' }}></i>
            </a>
          </p>
        );
      case 'address':
        return (
          <p key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
            <i className={`${iconTag} ${iconClass}`} style={{ color: '#2563eb', width: '20px' }}></i>
            {field.value}
          </p>
        );
      default:
        return (
          <p key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
            <i className={`${iconTag} ${iconClass}`} style={{ color: '#2563eb', width: '20px' }}></i>
            <span style={{ color: 'var(--text-color)' }}>{field.label}: {field.value}</span>
          </p>
        );
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
      <motion.div 
        className="card"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h3><i className="fas fa-address-card"></i> Contact Information</h3>
        <div style={{ marginTop: '1.5rem' }}>
          {/* Dynamic Contact Fields */}
          {contactFields.map(field => renderContactField(field))}

          {/* Address field is now handled in the dynamic fields */}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h4>Education</h4>
          <p style={{ marginTop: '0.3rem' }}>
            {education.degree || 'N/A'}<br />
            {education.institution || 'N/A'}
            {education.year && ` (${education.year})`}
          </p>
          {education.description && (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
              {education.description}
            </p>
          )}
        </div>

        {certifications.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4>Certifications</h4>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.3rem' }}>
              {certifications.slice(0, 3).map((cert) => (
                <li key={cert.id} style={{ padding: '0.2rem 0', fontSize: '0.9rem' }}>
                  <i className="fas fa-certificate" style={{ color: '#2563eb', marginRight: '0.5rem' }}></i>
                  {cert.name}
                </li>
              ))}
            </ul>
            {certifications.length > 3 && (
              <a href="/certifications" style={{ color: '#2563eb', fontSize: '0.9rem' }}>
                View all {certifications.length} certifications →
              </a>
            )}
          </div>
        )}
      </motion.div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h3><i className="fas fa-paper-plane"></i> Get In Touch</h3>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          I'll respond within 24-48 hours
        </p>
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">
              Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">
              Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              required
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-input"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="What's this about?"
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              Message <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              required
              rows="5"
              className="form-input"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell me about your project or inquiry..."
              style={{ resize: 'vertical' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Sending...</>
            ) : (
              <><i className="fas fa-paper-plane"></i> Send Message</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactPage;
