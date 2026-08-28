'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ServicesPage from '../components/ServicesPage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Services() {
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
      toast.error('Failed to load portfolio data');
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  return <ServicesPage data={data} />;
}
