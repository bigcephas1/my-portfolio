'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const SocialShare = ({ title, url }) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: title || 'Check out this blog post',
    url: url || window.location.href,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareTo = (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.title + ' ' + shareData.url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`,
      email: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.url)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
    setShowShare(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Copy Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.3rem 0.8rem',
          background: copied ? '#22c55e' : 'var(--bg-color)',
          color: copied ? 'white' : 'var(--text-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          transition: 'all 0.3s ease',
          marginRight: '0.3rem'
        }}
      >
        <i className={`fas ${copied ? 'fa-check-circle' : 'fa-copy'}`}></i>
        {copied ? 'Copied!' : 'Copy Link'}
      </motion.button>

      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowShare(!showShare)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.3rem 0.8rem',
          background: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          transition: 'all 0.3s ease'
        }}
      >
        <i className="fas fa-share-alt"></i>
        Share
      </motion.button>

      {/* Share Dropdown */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '0.8rem',
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              border: '1px solid var(--border-color)',
              minWidth: '200px',
              zIndex: 100,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.3rem'
            }}
          >
            {[
              { icon: 'fab fa-twitter', label: 'Twitter', key: 'twitter', color: '#1DA1F2' },
              { icon: 'fab fa-linkedin', label: 'LinkedIn', key: 'linkedin', color: '#0A66C2' },
              { icon: 'fab fa-facebook', label: 'Facebook', key: 'facebook', color: '#1877F2' },
              { icon: 'fab fa-whatsapp', label: 'WhatsApp', key: 'whatsapp', color: '#25D366' },
              { icon: 'fab fa-telegram', label: 'Telegram', key: 'telegram', color: '#0088cc' },
              { icon: 'fas fa-envelope', label: 'Email', key: 'email', color: '#EA4335' },
              { icon: 'fab fa-reddit', label: 'Reddit', key: 'reddit', color: '#FF4500' },
            ].map((platform) => (
              <motion.button
                key={platform.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => shareTo(platform.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.8rem',
                  background: 'transparent',
                  color: 'var(--text-color)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = `${platform.color}15`;
                  e.target.style.color = platform.color;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--text-color)';
                }}
              >
                <i className={platform.icon} style={{ color: platform.color, width: '20px' }}></i>
                {platform.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShare;
