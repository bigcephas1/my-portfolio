'use client';

import { motion } from 'framer-motion';

const SkillsPage = ({ data }) => {
  // Group skills by category
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
          <div key={category} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>{category}</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {skills.map((skill) => (
                <motion.span
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="badge badge-secondary"
                  style={{ 
                    fontSize: '0.85rem',
                    padding: '0.5rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {skill.name}
                  {skill.level && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: '#2563eb',
                      background: '#2563eb10',
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
