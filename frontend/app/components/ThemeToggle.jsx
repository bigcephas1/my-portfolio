'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      style={{
        padding: '0.5rem',
        borderRadius: '50%',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-color)',
        color: 'var(--text-color)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '42px',
        height: '42px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      >
        {isDark ? (
          <i className="fas fa-sun" style={{ color: '#f59e0b' }} />
        ) : (
          <i className="fas fa-moon" style={{ color: '#6366f1' }} />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
