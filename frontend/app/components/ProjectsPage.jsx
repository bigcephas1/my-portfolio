'use client';

import { motion } from 'framer-motion';

const ProjectsPage = ({ data }) => {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2><i className="fas fa-code-branch"></i> Projects</h2>
      <div style={{ marginTop: '1.5rem' }}>
        {data.projects?.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            style={{
              borderLeft: '3px solid #2563eb30',
              paddingLeft: '1.2rem',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>
              {project.name}
            </h3>
            <p style={{ color: '#475569', marginBottom: '0.8rem' }}>{project.description}</p>
            
            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div style={{ marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', marginRight: '0.5rem' }}>
                  <i className="fas fa-code"></i> Tech Stack:
                </span>
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      background: '#eef2f6',
                      padding: '0.15rem 0.7rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      marginRight: '0.3rem',
                      marginTop: '0.2rem',
                      color: '#1e293b'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* URLs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 1rem',
                    background: '#0b1a2e',
                    color: 'white',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <i className="fab fa-github"></i>
                  GitHub
                  <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                    <i className="fas fa-external-link-alt"></i>
                  </span>
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 1rem',
                    background: '#2563eb',
                    color: 'white',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(37,99,235,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(37,99,235,0.3)';
                  }}
                >
                  <i className="fas fa-globe"></i>
                  Live Demo
                  <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                    <i className="fas fa-external-link-alt"></i>
                  </span>
                </a>
              )}
            </div>

            {/* Project Image if available */}
            {project.image && (
              <div style={{ marginTop: '0.8rem' }}>
                <img 
                  src={project.image} 
                  alt={project.name} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }} 
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectsPage;
