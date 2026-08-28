'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const HomePage = ({ data }) => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Get the first few contact fields for the badges
  const contactFields = data.contactFields || [];
  const primaryContact = contactFields.find(f => f.type === 'email') || contactFields[0];

  return (
    <>
      <motion.div 
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem', flexWrap: 'wrap' }}>
          <motion.div 
            className="avatar"
            whileHover={{ scale: 1.03 }}
            onClick={() => setShowAvatarModal(true)}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb20, #1e293b30)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.8rem',
              fontWeight: 500,
              color: '#1e293b',
              border: '3px solid white',
              boxShadow: '0 8px 20px rgba(37,99,235,0.15)',
              cursor: 'pointer',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            {data.avatar ? (
              <img src={data.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>PU</span>
            )}
          </motion.div>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>Peter Uchenna Ukpabi</h2>
            <p style={{ color: '#2563eb', fontWeight: 600 }}>DevSecOps · Cloud · Platform Engineer</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
              <span className="badge badge-primary">
                <i className="fas fa-map-pin"></i> Nigeria (Remote/Relocation)
              </span>
              {contactFields.slice(0, 2).map((field) => {
                const iconClass = field.icon.startsWith('fa-') ? field.icon : `fa-${field.icon}`;
                const isFab = ['fa-github', 'fa-linkedin', 'fa-twitter', 'fa-youtube', 'fa-instagram', 
                               'fa-facebook', 'fa-tiktok', 'fa-twitch', 'fa-discord', 'fa-reddit', 
                               'fa-medium', 'fa-dev', 'fa-hashnode'].includes(iconClass);
                const iconTag = isFab ? 'fab' : 'fas';
                return (
                  <span key={field.id} className="badge badge-secondary">
                    <i className={`${iconTag} ${iconClass}`}></i> {field.value}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem', marginTop: '1.8rem' }}>
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3><i className="fas fa-user-tie"></i> Professional Summary</h3>
          <p style={{ marginTop: '0.5rem' }}>{data.summary}</p>
        </motion.div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3><i className="fas fa-bullseye"></i> Intro</h3>
          <p style={{ marginTop: '0.5rem' }}>{data.intro}</p>
        </motion.div>
      </div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginTop: '1.8rem' }}
      >
        <h3><i className="fas fa-rocket"></i> Core Competencies</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
          {[
            'Cloud Infrastructure Engineering', 'AWS Architecture', 'Platform Engineering',
            'Kubernetes Administration', 'Docker', 'CI/CD Engineering', 'GitOps', 'Cloud Security',
            'Linux Administration', 'Monitoring & Observability', 'High Availability',
            'Disaster Recovery', 'Incident Response', 'Performance Optimization',
            'Cost Optimization', 'Technical Documentation'
          ].map(skill => (
            <span key={skill} className="badge badge-secondary">
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAvatarModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2rem',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setShowAvatarModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              ×
            </button>
            {data.avatar ? (
              <img src={data.avatar} alt="avatar full" style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '12px' }} />
            ) : (
              <div style={{ fontSize: '8rem', padding: '2rem', background: '#eef2f6', borderRadius: '24px', textAlign: 'center' }}>
                PU
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default HomePage;
