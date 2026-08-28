'use client';

import { motion } from 'framer-motion';

const CertificationsPage = ({ data }) => {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2><i className="fas fa-certificate"></i> Certifications</h2>
      <div className="certifications-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginTop: '1.5rem'
      }}>
        {data.certifications?.map((cert, index) => (
          <motion.div
            key={cert.id}
            className="certification-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            style={{
              background: 'var(--bg-color)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {cert.image ? (
              <div className="cert-image" style={{ 
                width: '100%', 
                height: '150px', 
                overflow: 'hidden',
                borderRadius: '12px',
                marginBottom: '1rem',
                background: 'var(--bg-color)'
              }}>
                <img 
                  src={cert.image} 
                  alt={cert.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              </div>
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--primary-bg)',
                borderRadius: '12px',
                marginBottom: '1rem',
                fontSize: '3rem',
                color: 'var(--primary-color)'
              }}>
                <i className="fas fa-certificate"></i>
              </div>
            )}
            <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.3rem' }}>
              {cert.name}
            </h3>
            <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', width: '100%' }}>
              <p style={{ margin: '0.2rem 0' }}>
                <i className="fas fa-building" style={{ width: '1.2rem' }}></i> {cert.issuer}
              </p>
              <p style={{ margin: '0.2rem 0' }}>
                <i className="fas fa-calendar" style={{ width: '1.2rem' }}></i> {cert.date}
              </p>
              {cert.credentialId && (
                <p style={{ margin: '0.2rem 0', fontSize: '0.75rem' }}>
                  <i className="fas fa-id-card"></i> ID: {cert.credentialId}
                </p>
              )}
              {cert.credentialUrl && (
                <p style={{ margin: '0.5rem 0' }}>
                  <a 
                    href={cert.credentialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'var(--primary-color)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <i className="fas fa-external-link-alt"></i> Verify
                  </a>
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CertificationsPage;
