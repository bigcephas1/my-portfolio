'use client';

import { motion } from 'framer-motion';
import SocialShare from './SocialShare.jsx';

const BlogPage = ({ data }) => {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2><i className="fas fa-newspaper"></i> Blog / Posts</h2>
      <div style={{ marginTop: '1.5rem' }}>
        {data.blog?.map((post, index) => (
          <motion.div
            key={post.id}
            className="blog-post"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            style={{
              borderBottom: '1px solid var(--border-color)',
              padding: '1.2rem 0'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                {post.url ? (
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      textDecoration: 'none',
                      color: 'var(--text-color)',
                      display: 'inline-block'
                    }}
                  >
                    <h3 style={{ 
                      fontWeight: 600, 
                      fontSize: '1.05rem',
                      color: 'var(--text-color)',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
                    >
                      {post.title}
                      <i className="fas fa-external-link-alt" style={{ 
                        fontSize: '0.7rem', 
                        marginLeft: '0.5rem', 
                        color: 'var(--primary-color)',
                        opacity: 0.7
                      }}></i>
                    </h3>
                  </a>
                ) : (
                  <h3 style={{ fontWeight: 600, fontSize: '1.05rem' }}>{post.title}</h3>
                )}
              </div>
              {post.platform && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-light)',
                  background: 'var(--border-color)',
                  padding: '0.15rem 0.7rem',
                  borderRadius: '12px',
                  flexShrink: 0
                }}>
                  {post.platform}
                </span>
              )}
            </div>
            
            <div className="blog-meta" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
              <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                <i className="fas fa-calendar"></i> {post.date}
              </span>
              {post.readTime && (
                <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  <i className="fas fa-clock"></i> {post.readTime}
                </span>
              )}
            </div>
            
            <p style={{ marginTop: '0.3rem', color: 'var(--text-light)' }}>{post.excerpt}</p>
            
            {post.tags && post.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.7rem',
                      background: 'var(--primary-bg)',
                      color: 'var(--primary-color)',
                      padding: '0.1rem 0.6rem',
                      borderRadius: '12px'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="blog-actions" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginTop: '0.8rem',
              flexWrap: 'wrap'
            }}>
              {post.url && (
                <a 
                  href={post.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: '0.85rem',
                    color: 'var(--primary-color)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <i className="fas fa-arrow-right"></i> Read full article
                </a>
              )}
              
              <SocialShare 
                title={post.title} 
                url={post.url || window.location.href} 
              />
            </div>

            {post.image && (
              <div style={{ marginTop: '0.8rem' }}>
                <img 
                  src={post.image} 
                  alt={post.title}
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

export default BlogPage;
