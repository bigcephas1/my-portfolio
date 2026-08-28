'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = ({ data }) => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImages = () => {
    if (data.galleryImages && data.galleryImages.length > 0) {
      return data.galleryImages.map(img => img.url);
    }
    
    const fallbackImages = [
      data.avatar,
      data.about?.profileImage
    ].filter(Boolean);
    
    return fallbackImages;
  };

  const profileImages = getImages();
  const hasImages = profileImages.length > 0;

  useEffect(() => {
    if (!hasImages || profileImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % profileImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [profileImages.length, hasImages]);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % profileImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + profileImages.length) % profileImages.length);
  };

  if (!hasImages) {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <h3><i className="fas fa-bullseye"></i> Intro</h3>
            <p>{data.intro}</p>
          </div>
          <div className="card">
            <h3><i className="fas fa-user-tie"></i> Professional Summary</h3>
            <p>{data.summary}</p>
          </div>
        </div>
        
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3><i className="fas fa-rocket"></i> Core Competencies</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
            {[
              'Cloud Infrastructure Engineering', 'AWS Architecture', 'Platform Engineering',
              'Kubernetes Administration', 'Docker', 'CI/CD Engineering', 'GitOps', 'Cloud Security',
              'Linux Administration', 'Monitoring & Observability', 'High Availability',
              'Disaster Recovery', 'Incident Response', 'Performance Optimization',
              'Cost Optimization', 'Technical Documentation'
            ].map(skill => (
              <span key={skill} className="badge badge-secondary">{skill}</span>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1.5fr', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '400px',
            background: 'var(--bg-card)',
            borderRadius: '28px',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '350px',
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'var(--bg-color)'
          }}>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '350px',
                  position: 'relative'
                }}
                onClick={() => setShowAvatarModal(true)}
              >
                <img 
                  src={profileImages[currentImageIndex]} 
                  alt={`Profile ${currentImageIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '350px',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                  onError={(e) => {
                    console.error('❌ Image failed to load:', profileImages[currentImageIndex]);
                    e.target.style.display = 'none';
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {profileImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(37,99,235,0.8)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.5)'}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(37,99,235,0.8)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.5)'}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}

            {profileImages.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '0.5rem',
                background: 'rgba(0,0,0,0.5)',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                zIndex: 10
              }}>
                {profileImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToImage(index);
                    }}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: 'none',
                      background: currentImageIndex === index ? '#2563eb' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: '0'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {profileImages.length > 1 && (
            <p style={{
              marginTop: '0.8rem',
              fontSize: '0.85rem',
              color: 'var(--text-light)',
              opacity: 0.7
            }}>
              {currentImageIndex + 1} / {profileImages.length} • <i className="fas fa-expand"></i> Click to view full size
            </p>
          )}
        </motion.div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem'
        }}>
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{ flex: 1 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                background: 'var(--primary-bg)',
                padding: '0.5rem 0.8rem',
                borderRadius: '12px',
                color: 'var(--primary-color)',
                fontSize: '1.2rem'
              }}>
                <i className="fas fa-bullseye"></i>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.3rem' }}>Intro</h3>
                <p style={{ color: 'var(--text-light)' }}>{data.intro}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ flex: 1 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                background: 'var(--primary-bg)',
                padding: '0.5rem 0.8rem',
                borderRadius: '12px',
                color: 'var(--primary-color)',
                fontSize: '1.2rem'
              }}>
                <i className="fas fa-user-tie"></i>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.3rem' }}>Professional Summary</h3>
                <p style={{ color: 'var(--text-light)' }}>{data.summary}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ marginBottom: '2rem' }}
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
            <span key={skill} className="badge badge-secondary">{skill}</span>
          ))}
        </div>
      </motion.div>

      {showAvatarModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAvatarModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
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
                color: '#64748b',
                zIndex: 1
              }}
            >
              ×
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profileImages.map((img, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <img 
                    src={img} 
                    alt={`Profile ${index + 1}`}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '60vh', 
                      borderRadius: '12px',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {profileImages.length > 1 && (
                    <p style={{ marginTop: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                      Image {index + 1} of {profileImages.length}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default HomePage;
