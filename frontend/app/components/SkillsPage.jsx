'use client';

import { motion } from 'framer-motion';

const SkillsPage = ({ data }) => {
  const groupedSkills = data.skills?.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2><i className="fas fa-cogs"></i> Technical Skills</h2>
      <div style={{ marginTop: '1.5rem' }}>
        {Object.entries(groupedSkills || {}).map(([category, skills]) => (
          <div key={category} className="skills-category" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>{category}</h4>
            <div className="skills-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {skills.map((skill) => (
                <motion.span
                  key={skill.id}
                  className="skill-tag"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ 
                    fontSize: '0.85rem',
                    padding: '0.5rem 1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--border-color)',
                    borderRadius: '30px',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {skill.name}
                  {skill.level && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: '#2563eb',
                      background: 'var(--primary-bg)',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '12px'
                    }}>
                      {skill.level}%
                    </span>
                  )}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsPage;
