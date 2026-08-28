// app/components/ExperiencePage.js
'use client';

import { motion } from 'framer-motion';

const ExperiencePage = ({ data }) => {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2><i className="fas fa-briefcase"></i> Professional Experience</h2>
      <div style={{ marginTop: '1.5rem' }}>
        {data.experience.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              borderLeft: '3px solid #2563eb30',
              paddingLeft: '1.2rem',
              marginBottom: '2rem'
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{exp.title}</h3>
            <div style={{ color: '#475569', fontSize: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span><i className="fas fa-building"></i> {exp.company}</span>
              <span><i className="fas fa-calendar"></i> {exp.period}</span>
            </div>
            <p style={{ marginTop: '0.5rem' }}>{exp.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExperiencePage;
