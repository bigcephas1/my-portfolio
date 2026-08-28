'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Hire() {
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
        <h2><i className="fas fa-handshake"></i> Hire Me</h2>
        <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
          <i className="fas fa-info-circle"></i> No data available.
        </p>
        <button className="btn-primary" onClick={fetchData} style={{ marginTop: '1rem' }}>
          <i className="fas fa-sync"></i> Retry
        </button>
      </div>
    );
  }

  const hire = data.hire || {};

  return (
    <div className="card">
      <h2><i className="fas fa-handshake"></i> Hire Me</h2>
      <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
        Let's work together! Here's what you need to know about working with me.
      </p>
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem'
        }}>
          <div className="hire-card" style={{ 
            background: 'var(--bg-color)', 
            padding: '1.5rem', 
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            color: 'var(--text-color)'
          }}>
            <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
              <i className="fas fa-money-bill-wave" style={{ color: '#2563eb' }}></i> Salary Expectation
            </h4>
            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-color)' }}>
              {hire.salaryExpectation || 'Negotiable'}
            </p>
          </div>
          <div className="hire-card" style={{ 
            background: 'var(--bg-color)', 
            padding: '1.5rem', 
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            color: 'var(--text-color)'
          }}>
            <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
              <i className="fas fa-clock" style={{ color: '#2563eb' }}></i> Notice Period
            </h4>
            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-color)' }}>
              {hire.noticePeriod || 'Negotiable'}
            </p>
          </div>
          <div className="hire-card" style={{ 
            background: 'var(--bg-color)', 
            padding: '1.5rem', 
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            color: 'var(--text-color)'
          }}>
            <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
              <i className="fas fa-calendar-check" style={{ color: '#2563eb' }}></i> Availability
            </h4>
            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-color)' }}>
              {hire.availability || 'Immediate'}
            </p>
          </div>
          <div className="hire-card" style={{ 
            background: 'var(--bg-color)', 
            padding: '1.5rem', 
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            color: 'var(--text-color)'
          }}>
            <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
              <i className="fas fa-laptop-house" style={{ color: '#2563eb' }}></i> Preferred Work
            </h4>
            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-color)' }}>
              {hire.preferredWork || 'Remote / Hybrid'}
            </p>
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>
            <i className="fas fa-paper-plane"></i> Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
