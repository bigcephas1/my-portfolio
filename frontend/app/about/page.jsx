'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/portfolio`);
      setData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (!data) {
    return (
      <div className="card">
        <h2><i className="fas fa-user"></i> About Me</h2>
        <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
          <i className="fas fa-info-circle"></i> No data available. Please check your connection.
        </p>
        <button className="btn-primary" onClick={fetchData} style={{ marginTop: '1rem' }}>
          <i className="fas fa-sync"></i> Retry
        </button>
      </div>
    );
  }

  const about = data.about || {};
  const profileImage = about.profileImage || data.avatar || '';

  return (
    <div className="card">
      <h2><i className="fas fa-user"></i> About Me</h2>
      <div style={{ marginTop: '1.5rem' }}>
        <div className="about-section" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {profileImage && (
            <div style={{ flexShrink: 0, margin: '0 auto' }}>
              <img 
                className="about-image"
                src={profileImage} 
                alt="Profile" 
                style={{ 
                  width: '200px', 
                  height: '200px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="about-content" style={{ flex: 1 }}>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
              {about.bio || 'Passionate DevSecOps Engineer with a strong background in cloud infrastructure.'}
            </p>
            {about.experience && (
              <div style={{ marginTop: '1rem' }}>
                <h4><i className="fas fa-briefcase"></i> Experience</h4>
                <p>{about.experience}</p>
              </div>
            )}
            {about.philosophy && (
              <div style={{ marginTop: '1rem' }}>
                <h4><i className="fas fa-lightbulb"></i> Philosophy</h4>
                <p>{about.philosophy}</p>
              </div>
            )}
            {about.interests && about.interests.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4><i className="fas fa-heart"></i> Interests</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.3rem' }}>
                  {about.interests.map((interest, i) => (
                    <span key={i} className="badge badge-secondary">{interest}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="about-actions" style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>
                <i className="fas fa-paper-plane"></i> Contact Me
              </a>
              <a href="/hire" className="btn-outline" style={{ textDecoration: 'none' }}>
                <i className="fas fa-handshake"></i> Hire Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
