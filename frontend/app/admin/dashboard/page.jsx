'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '../../components/ProtectedRoute.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [contactStats, setContactStats] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    fetchPortfolio();
    fetchContacts();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(`${API_URL}/portfolio`);
      setPortfolio(res.data.data);
      setFormData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to fetch portfolio data');
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const [contactsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/contact`),
        axios.get(`${API_URL}/contact/stats`)
      ]);
      setContacts(contactsRes.data.data.contacts);
      setContactStats(statsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const handleUpdate = async (dataToUpdate = null) => {
    try {
      const updateData = dataToUpdate || formData;
      const res = await axios.put(`${API_URL}/portfolio`, updateData);
      setPortfolio(res.data.data);
      setFormData(res.data.data);
      toast.success('Portfolio updated successfully!');
      return true;
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update portfolio');
      return false;
    }
  };

  const handleImageUpload = async (e, targetField = 'avatar') => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    setUploading(true);

    try {
      const res = await axios.post(`${API_URL}/portfolio/upload`, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = res.data.data.url;
      
      if (targetField === 'avatar') {
        const updatedFormData = {
          ...formData,
          avatar: imageUrl,
          about: { ...formData.about, profileImage: imageUrl }
        };
        setFormData(updatedFormData);
        await handleUpdate(updatedFormData);
      } else if (targetField === 'about') {
        const updatedFormData = {
          ...formData,
          about: { ...formData.about, profileImage: imageUrl }
        };
        setFormData(updatedFormData);
        await handleUpdate(updatedFormData);
      }
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // FIXED: Education Add Handler
  const handleAddItem = async (section) => {
    if (section === 'education') {
      const item = {
        id: Date.now(),
        degree: newItem.degree || '',
        institution: newItem.institution || '',
        year: newItem.year || '',
        description: newItem.description || '',
        grade: newItem.grade || '',
        location: newItem.location || '',
        certificateImage: newItem.certificateImage || ''
      };
      
      const currentEducation = Array.isArray(formData.education) ? formData.education : [];
      const updatedSection = [...currentEducation, item];
      const updatedFormData = { ...formData, education: updatedSection };
      setFormData(updatedFormData);
      setShowAddModal(false);
      setNewItem({});
      await handleUpdate(updatedFormData);
      toast.success('Education added successfully!');
    } else {
      const item = {
        id: Date.now(),
        ...newItem
      };
      
      const updatedSection = [...(formData[section] || []), item];
      const updatedFormData = { ...formData, [section]: updatedSection };
      setFormData(updatedFormData);
      setShowAddModal(false);
      setNewItem({});
      await handleUpdate(updatedFormData);
      toast.success(`${section.slice(0, -1)} added successfully!`);
    }
  };

  // FIXED: Education Delete Handler
  const handleDeleteItem = async (section, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    if (section === 'education') {
      const updatedSection = formData.education.filter(item => item.id !== id);
      const updatedFormData = { ...formData, education: updatedSection };
      setFormData(updatedFormData);
      await handleUpdate(updatedFormData);
      toast.success('Education deleted successfully!');
    } else {
      const updatedSection = formData[section].filter(item => item.id !== id);
      const updatedFormData = { ...formData, [section]: updatedSection };
      setFormData(updatedFormData);
      await handleUpdate(updatedFormData);
      toast.success('Item deleted successfully!');
    }
  };

  // ... rest of the functions remain the same

  // Rest of the dashboard render code...
  // (Keep the rest of the dashboard code from the previous version)
  // I'll provide the full file in the next step
