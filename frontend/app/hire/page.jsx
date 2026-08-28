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

  const hire = data.hire || {};

  return (
    <div className="card">
      <h2><i className="fas fa-handshake"></i> Hire Me</h2>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
        Let's work together! Here's what you need to know about working with me.
      </p>
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem'
        }}>
          <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '16px' }}>
            <h4><i className="fas fa-money-bill-wave" style={{ color: '#2563eb' }}></i> Salary Expectation</h4>
            <p style={{ fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: 600 }}>
              {hire.salaryExpectation || 'Negotiable'}
            </p>
          </div>
          <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '16px' }}>
            <h4><i className="fas fa-clock" style={{ color: '#2563eb' }}></i> Notice Period</h4>
            <p style={{ fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: 600 }}>
              {hire.noticePeriod || 'Negotiable'}
            </p>
          </div>
          <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '16px' }}>
            <h4><i className="fas fa-calendar-check" style={{ color: '#2563eb' }}></i> Availability</h4>
            <p style={{ fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: 600 }}>
              {hire.availability || 'Immediate'}
            </p>
          </div>
          <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '16px' }}>
            <h4><i className="fas fa-laptop-house" style={{ color: '#2563eb' }}></i> Preferred Work</h4>
            <p style={{ fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: 600 }}>
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
