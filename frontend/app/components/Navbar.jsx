'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: '', label: 'Home', icon: 'fa-home', path: '/' },
    { id: 'about', label: 'About Me', icon: 'fa-user', path: '/about' },
    { id: 'projects', label: 'Projects', icon: 'fa-code-branch', path: '/projects' },
    { id: 'experience', label: 'Experience', icon: 'fa-briefcase', path: '/experience' },
    { id: 'skills', label: 'Skills', icon: 'fa-cogs', path: '/skills' },
    { id: 'services', label: 'Services', icon: 'fa-concierge-bell', path: '/services' },
    { id: 'certifications', label: 'Certifications', icon: 'fa-certificate', path: '/certifications' },
    { id: 'blog', label: 'Blog', icon: 'fa-newspaper', path: '/blog' },
    { id: 'contact', label: 'Contact', icon: 'fa-envelope', path: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 0 1.2rem',
        borderBottom: '2px solid var(--border-color)',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '0.8rem',
        background: 'var(--bg-color)',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
    >
      {/* Logo and Hamburger */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        flexWrap: 'wrap'
      }}>
        <Link 
          href="/" 
          className="navbar-brand"
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            background: 'linear-gradient(145deg, #1e293b, #2563eb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
            padding: '0.2rem 0'
          }}
          onClick={closeMobileMenu}
        >
          <i className="fas fa-cloud" style={{ WebkitTextFillColor: '#2563eb', marginRight: '8px' }}></i>
          Peter.U
        </Link>

        {/* Hamburger Menu Button - Mobile */}
        <button
          className="hamburger"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.3rem 0.5rem',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            minHeight: '44px',
            minWidth: '44px',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Navigation Links */}
      <div 
        className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.3rem 0.8rem',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'flex-end',
          transition: 'all 0.3s ease'
        }}
      >
        {navItems.map(item => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.path}
                onClick={closeMobileMenu}
                style={{
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  color: isActive ? 'var(--primary-color)' : 'var(--text-color)',
                  padding: '0.4rem 1rem',
                  borderRadius: '40px',
                  backgroundColor: isActive ? 'var(--primary-bg)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: isActive ? '1px solid var(--primary-color)' : '1px solid transparent',
                  minHeight: '44px'
                }}
              >
                <i className={`fas ${item.icon}`} style={{ fontSize: '0.85rem' }}></i>
                {item.label}
              </Link>
            </motion.div>
          );
        })}
        
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="theme-toggle"
          style={{
            padding: '0.5rem 0.7rem',
            borderRadius: '50%',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            minHeight: '44px',
            minWidth: '44px'
          }}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <i className="fas fa-sun" style={{ color: '#f59e0b' }}></i>
          ) : (
            <i className="fas fa-moon" style={{ color: '#6366f1' }}></i>
          )}
        </motion.button>

        {/* Auth Buttons */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              href="/admin/dashboard"
              onClick={closeMobileMenu}
              style={{
                textDecoration: 'none',
                padding: '0.4rem 1.2rem',
                fontSize: '0.85rem',
                borderRadius: '40px',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                minHeight: '44px'
              }}
            >
              <i className="fas fa-dashboard"></i> Dashboard
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{
                padding: '0.4rem 1.2rem',
                fontSize: '0.85rem',
                borderRadius: '40px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                minHeight: '44px'
              }}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </motion.button>
          </div>
        ) : (
          <Link
            href="/hire"
            onClick={closeMobileMenu}
            style={{
              textDecoration: 'none',
              padding: '0.4rem 1.5rem',
              fontSize: '0.9rem',
              borderRadius: '40px',
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px var(--primary-shadow)',
              minHeight: '44px'
            }}
          >
            <i className="fas fa-handshake"></i> Hire Me
          </Link>
        )}
      </div>

      {/* Mobile Menu Overlay - when menu is open, prevent scrolling */}
      {isMobileMenuOpen && (
        <style jsx>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )}
    </motion.nav>
  );
};

export default Navbar;
