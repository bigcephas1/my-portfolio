'use client';

import { motion } from 'framer-motion';

const ServicesPage = ({ data }) => {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2><i className="fas fa-concierge-bell"></i> Services</h2>
      <div className="services-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        {data.services?.map((service) => (
          <motion.div
            key={service.id}
            className="service-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--bg-color)',
              padding: '1.2rem 1.5rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {service.icon && (
                <div className="service-icon" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3rem',
                  height: '3rem',
                  background: 'var(--primary-bg)',
                  borderRadius: '12px',
                  flexShrink: 0
                }}>
                  <i className={`fas ${service.icon}`} style={{ 
                    color: '#2563eb', 
                    fontSize: '1.5rem'
                  }}></i>
                </div>
              )}
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{service.name}</h4>
                {service.description && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{service.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServicesPage;
