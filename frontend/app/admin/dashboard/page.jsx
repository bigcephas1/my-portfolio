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
      
      const currentSection = Array.isArray(formData[section]) ? formData[section] : [];
      const updatedSection = [...currentSection, item];
      const updatedFormData = { ...formData, [section]: updatedSection };
      setFormData(updatedFormData);
      setShowAddModal(false);
      setNewItem({});
      await handleUpdate(updatedFormData);
      toast.success(`${section.slice(0, -1)} added successfully!`);
    }
  };

  const handleDeleteItem = async (section, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    if (section === 'education') {
      const currentEducation = Array.isArray(formData.education) ? formData.education : [];
      const updatedSection = currentEducation.filter(item => item.id !== id);
      const updatedFormData = { ...formData, education: updatedSection };
      setFormData(updatedFormData);
      await handleUpdate(updatedFormData);
      toast.success('Education deleted successfully!');
    } else {
      const currentSection = Array.isArray(formData[section]) ? formData[section] : [];
      const updatedSection = currentSection.filter(item => item.id !== id);
      const updatedFormData = { ...formData, [section]: updatedSection };
      setFormData(updatedFormData);
      await handleUpdate(updatedFormData);
      toast.success('Item deleted successfully!');
    }
  };

  const handleAddInterest = async () => {
    if (!newInterest.trim()) {
      toast.error('Please enter an interest');
      return;
    }

    const currentInterests = Array.isArray(formData?.about?.interests) ? formData.about.interests : [];
    
    if (currentInterests.includes(newInterest.trim())) {
      toast.error('This interest already exists');
      return;
    }

    const updatedInterests = [...currentInterests, newInterest.trim()];
    const updatedFormData = {
      ...formData,
      about: { 
        ...formData.about, 
        interests: updatedInterests 
      }
    };
    
    setFormData(updatedFormData);
    setNewInterest('');
    await handleUpdate(updatedFormData);
    toast.success('Interest added!');
  };

  const handleRemoveInterest = async (index) => {
    const currentInterests = Array.isArray(formData?.about?.interests) ? formData.about.interests : [];
    const updatedInterests = currentInterests.filter((_, i) => i !== index);
    const updatedFormData = {
      ...formData,
      about: { 
        ...formData.about, 
        interests: updatedInterests 
      }
    };
    
    setFormData(updatedFormData);
    await handleUpdate(updatedFormData);
    toast.success('Interest removed!');
  };

  const handleUpdateContactStatus = async (contactId, status) => {
    try {
      await axios.put(`${API_URL}/contact/${contactId}/status`, { status });
      toast.success('Contact status updated!');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update contact status');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Delete this contact message?')) return;
    try {
      await axios.delete(`${API_URL}/contact/${contactId}`);
      toast.success('Contact deleted!');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) return <LoadingSpinner />;

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h3>📊 Portfolio Overview</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '1rem', 
              marginTop: '1.5rem' 
            }}>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>
                  {portfolio.projects?.length || 0}
                </div>
                <div style={{ color: '#64748b' }}>Projects</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>
                  {portfolio.experience?.length || 0}
                </div>
                <div style={{ color: '#64748b' }}>Experience</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>
                  {portfolio.skills?.length || 0}
                </div>
                <div style={{ color: '#64748b' }}>Skills</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>
                  {portfolio.services?.length || 0}
                </div>
                <div style={{ color: '#64748b' }}>Services</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>
                  {portfolio.blog?.length || 0}
                </div>
                <div style={{ color: '#64748b' }}>Blog Posts</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>
                  {portfolio.certifications?.length || 0}
                </div>
                <div style={{ color: '#64748b' }}>Certifications</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>
                  {portfolio.contactFields?.length || 0}
                </div>
                <div style={{ color: '#64748b' }}>Contact Fields</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>
                  {Array.isArray(portfolio.education) ? portfolio.education.length : 0}
                </div>
                <div style={{ color: '#64748b' }}>Education</div>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h4>Quick Actions</h4>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <button className="btn-primary" onClick={() => setActiveTab('content')}>
                  <i className="fas fa-edit"></i> Edit Content
                </button>
                <button className="btn-primary" onClick={() => setActiveTab('messages')}>
                  <i className="fas fa-envelope"></i> View Messages
                  {contactStats?.new > 0 && (
                    <span style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      borderRadius: '50%',
                      padding: '0.1rem 0.5rem',
                      fontSize: '0.7rem',
                      marginLeft: '0.3rem'
                    }}>
                      {contactStats.new}
                    </span>
                  )}
                </button>
                <button className="btn-outline" onClick={fetchPortfolio}>
                  <i className="fas fa-sync"></i> Refresh
                </button>
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div>
            <h3>📨 Contact Messages</h3>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '1rem', 
              flexWrap: 'wrap' 
            }}>
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{contactStats?.total || 0}</div>
                <div style={{ color: '#64748b' }}>Total</div>
              </div>
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: '1rem', background: '#fef3c7' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{contactStats?.new || 0}</div>
                <div style={{ color: '#64748b' }}>🆕 New</div>
              </div>
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: '1rem', background: '#dbeafe' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{contactStats?.read || 0}</div>
                <div style={{ color: '#64748b' }}>📖 Read</div>
              </div>
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: '1rem', background: '#d1fae5' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{contactStats?.replied || 0}</div>
                <div style={{ color: '#64748b' }}>✅ Replied</div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              {contacts.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                  <i className="fas fa-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                  No messages yet
                </p>
              ) : (
                contacts.map(contact => (
                  <div key={contact._id} style={{ 
                    borderBottom: '1px solid var(--border-color)', 
                    padding: '1rem 0',
                    background: contact.status === 'new' ? '#fef3c710' : 'transparent'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <strong>{contact.name}</strong>
                          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                            ({contact.email})
                          </span>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            color: '#64748b'
                          }}>
                            {new Date(contact.createdAt).toLocaleDateString()} {new Date(contact.createdAt).toLocaleTimeString()}
                          </span>
                          <span className={`badge ${
                            contact.status === 'new' ? 'badge-primary' : 
                            contact.status === 'read' ? 'badge-secondary' :
                            contact.status === 'replied' ? 'badge' : 'badge-secondary'
                          }`} style={{ 
                            background: contact.status === 'new' ? '#2563eb' :
                                      contact.status === 'read' ? '#f59e0b' :
                                      contact.status === 'replied' ? '#22c55e' : '#64748b',
                            color: 'white'
                          }}>
                            {contact.status}
                          </span>
                        </div>
                        {contact.subject && (
                          <p style={{ margin: '0.3rem 0', fontWeight: 500 }}>Subject: {contact.subject}</p>
                        )}
                        <p style={{ margin: '0.3rem 0', color: '#475569' }}>{contact.message}</p>
                        {contact.notes && (
                          <p style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: '#64748b' }}>
                            <i className="fas fa-sticky-note"></i> Notes: {contact.notes}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '0.2rem 0.8rem', fontSize: '0.75rem' }}
                          onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your inquiry'}`, '_blank')}
                        >
                          <i className="fas fa-reply"></i> Reply
                        </button>
                        {contact.status === 'new' && (
                          <button 
                            className="btn-outline" 
                            style={{ padding: '0.2rem 0.8rem', fontSize: '0.75rem' }}
                            onClick={() => handleUpdateContactStatus(contact._id, 'read')}
                          >
                            <i className="fas fa-check"></i> Mark Read
                          </button>
                        )}
                        {contact.status !== 'replied' && (
                          <button 
                            className="btn-primary" 
                            style={{ padding: '0.2rem 0.8rem', fontSize: '0.75rem', background: '#22c55e' }}
                            onClick={() => {
                              const notes = prompt('Add notes about this conversation:');
                              if (notes !== null) {
                                axios.put(`${API_URL}/contact/${contact._id}/status`, { 
                                  status: 'replied', 
                                  notes 
                                }).then(() => fetchContacts());
                              }
                            }}
                          >
                            <i className="fas fa-check-double"></i> Mark Replied
                          </button>
                        )}
                        <button 
                          className="btn-danger" 
                          style={{ padding: '0.2rem 0.8rem', fontSize: '0.75rem' }}
                          onClick={() => handleDeleteContact(contact._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'content':
        return (
          <div>
            <h3>✏️ Edit Content</h3>
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {['homepage','avatar', 'about', 'experience', 'projects', 'skills', 'services', 'blog', 'certifications', 'education', 'contactFields', 'hire'].map(section => (
                  <button
                    key={section}
                    className={editingItem === section ? 'btn-primary' : 'btn-outline'}
                    onClick={() => setEditingItem(editingItem === section ? null : section)}
                    style={{ padding: '0.3rem 1rem', fontSize: '0.85rem' }}
                  >
                    {section === 'contactFields' ? 'Contact Fields' : section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>

              {/* Avatar Section */}
              {editingItem === 'avatar' && (
                <div className="card" style={{ marginBottom: '1rem' }}>
                  <h4>Profile Images Gallery</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                    Upload multiple images for the carousel. They will auto-rotate on the homepage.
                  </p>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                      <i className="fas fa-upload"></i> {uploading ? 'Uploading...' : 'Add Image to Gallery'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const formDataUpload = new FormData();
                          formDataUpload.append('image', file);
                          setUploading(true);

                          try {
                            await axios.post(`${API_URL}/portfolio/upload`, formDataUpload, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            await fetchPortfolio();
                            toast.success('Image added to gallery!');
                          } catch (error) {
                            toast.error('Failed to upload image');
                          } finally {
                            setUploading(false);
                          }
                        }}
                        style={{ display: 'none' }}
                        disabled={uploading}
                        multiple
                      />
                    </label>
                  </div>

                  {formData.galleryImages && formData.galleryImages.length > 0 ? (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      {formData.galleryImages.map((img, index) => (
                        <div key={img.id} style={{
                          position: 'relative',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: 'var(--bg-color)'
                        }}>
                          <img 
                            src={img.url} 
                            alt={img.alt || `Gallery image ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '150px',
                              objectFit: 'cover'
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            display: 'flex',
                            gap: '0.3rem'
                          }}>
                            <button
                              className="btn-danger"
                              style={{ 
                                padding: '0.2rem 0.5rem', 
                                fontSize: '0.7rem',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onClick={async () => {
                                if (!confirm('Remove this image from gallery?')) return;
                                try {
                                  await axios.delete(`${API_URL}/portfolio/gallery/${img.id}`);
                                  await fetchPortfolio();
                                  toast.success('Image removed');
                                } catch (error) {
                                  toast.error('Failed to remove image');
                                }
                              }}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          <div style={{
                            padding: '0.3rem 0.5rem',
                            fontSize: '0.7rem',
                            color: 'var(--text-light)',
                            textAlign: 'center',
                            background: 'var(--bg-card)'
                          }}>
                            #{index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      padding: '2rem',
                      textAlign: 'center',
                      border: '2px dashed var(--border-color)',
                      borderRadius: '12px',
                      color: 'var(--text-light)'
                    }}>
                      <i className="fas fa-images" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                      No images in gallery yet. Upload your first image!
                    </div>
                  )}

                  <div style={{ 
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    <h5>Primary Avatar</h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                      <div>
                        {formData.avatar ? (
                          <img 
                            src={formData.avatar} 
                            alt="Avatar" 
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fas fa-user" style={{ fontSize: '2rem', color: '#64748b' }}></i>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-block', fontSize: '0.85rem' }}>
                          <i className="fas fa-upload"></i> Update Avatar
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
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
                                
                                const updatedFormData = { ...formData, avatar: imageUrl };
                                setFormData(updatedFormData);
                                await handleUpdate(updatedFormData);
                                toast.success('Avatar updated!');
                              } catch (error) {
                                toast.error('Failed to update avatar');
                              } finally {
                                setUploading(false);
                              }
                            }}
                            style={{ display: 'none' }}
                            disabled={uploading}
                          />
                        </label>
                        {formData.avatar && (
                          <button
                            className="btn-danger"
                            style={{ marginLeft: '0.5rem', padding: '0.3rem 1rem', fontSize: '0.85rem' }}
                            onClick={async () => {
                              if (!confirm('Remove avatar?')) return;
                              const updatedFormData = { ...formData, avatar: '' };
                              setFormData(updatedFormData);
                              await handleUpdate(updatedFormData);
                              toast.success('Avatar removed');
                            }}
                          >
                            <i className="fas fa-trash"></i> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* About Section */}
              {editingItem === 'about' && (
                <div className="card">
                  <h4>About Me</h4>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-input"
                      rows="3"
                      value={formData.about?.bio || ''}
                      onChange={(e) => {
                        const updatedFormData = {
                          ...formData,
                          about: { ...formData.about, bio: e.target.value }
                        };
                        setFormData(updatedFormData);
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Experience Summary</label>
                    <textarea
                      className="form-input"
                      rows="2"
                      value={formData.about?.experience || ''}
                      onChange={(e) => {
                        const updatedFormData = {
                          ...formData,
                          about: { ...formData.about, experience: e.target.value }
                        };
                        setFormData(updatedFormData);
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Philosophy</label>
                    <input
                      className="form-input"
                      value={formData.about?.philosophy || ''}
                      onChange={(e) => {
                        const updatedFormData = {
                          ...formData,
                          about: { ...formData.about, philosophy: e.target.value }
                        };
                        setFormData(updatedFormData);
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Interests</label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.3rem' }}>
                      Type an interest and press Enter or click Add. Click the × on any tag to remove it.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        className="form-input"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddInterest();
                          }
                        }}
                        placeholder="e.g., Cloud Computing, Kubernetes, Machine Learning"
                        style={{ flex: 1 }}
                      />
                      <button
                        className="btn-primary"
                        style={{ padding: '0.3rem 1.5rem', whiteSpace: 'nowrap' }}
                        onClick={handleAddInterest}
                      >
                        <i className="fas fa-plus"></i> Add
                      </button>
                    </div>

                    {formData.about?.interests && formData.about.interests.length > 0 ? (
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '0.5rem', 
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        background: 'var(--bg-color)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        minHeight: '40px'
                      }}>
                        {formData.about.interests.map((interest, i) => (
                          <span key={i} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background: 'var(--primary-bg)',
                            color: 'var(--primary-color)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            border: '1px solid var(--primary-color)'
                          }}>
                            {interest}
                            <button
                              onClick={() => handleRemoveInterest(i)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary-color)',
                                cursor: 'pointer',
                                padding: '0 0 0 0.3rem',
                                fontSize: '0.7rem',
                                opacity: 0.7
                              }}
                              onMouseEnter={(e) => e.target.style.opacity = '1'}
                              onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ 
                        padding: '0.5rem',
                        background: 'var(--bg-color)',
                        borderRadius: '12px',
                        border: '1px dashed var(--border-color)',
                        color: 'var(--text-light)',
                        textAlign: 'center',
                        fontSize: '0.85rem'
                      }}>
                        <i className="fas fa-info-circle"></i> No interests added yet.
                      </div>
                    )}
                  </div>

                  <button className="btn-primary" onClick={() => handleUpdate()}>
                    <i className="fas fa-save"></i> Save About
                  </button>
                </div>
              )}

              {/* Experience Section */}
              {editingItem === 'experience' && (
                <div className="card">
                  <h4>Experience</h4>
                  <button className="btn-primary" style={{ marginBottom: '1rem' }} onClick={() => {
                    setNewItem({ title: '', company: '', period: '', description: '' });
                    setShowAddModal(true);
                  }}>
                    <i className="fas fa-plus"></i> Add Experience
                  </button>
                  {formData.experience?.map((exp) => (
                    <div key={exp.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{exp.title}</strong>
                        <button className="btn-danger" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDeleteItem('experience', exp.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            experience: formData.experience.map(item => 
                              item.id === exp.id ? { ...item, company: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Period (e.g., Jan 2022 - Present)"
                        value={exp.period}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            experience: formData.experience.map(item => 
                              item.id === exp.id ? { ...item, period: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <textarea
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        rows="3"
                        placeholder="Description"
                        value={exp.description}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            experience: formData.experience.map(item => 
                              item.id === exp.id ? { ...item, description: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => handleUpdate()}>
                    <i className="fas fa-save"></i> Save All Experience
                  </button>
                </div>
              )}

              {/* Projects Section */}
              {editingItem === 'projects' && (
                <div className="card">
                  <h4>Projects</h4>
                  <button className="btn-primary" style={{ marginBottom: '1rem' }} onClick={() => {
                    setNewItem({ 
                      name: '', 
                      description: '', 
                      techStack: [], 
                      githubUrl: '', 
                      liveUrl: '',
                      image: ''
                    });
                    setShowAddModal(true);
                  }}>
                    <i className="fas fa-plus"></i> Add Project
                  </button>
                  {formData.projects?.map((project) => (
                    <div key={project.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{project.name}</strong>
                        <button className="btn-danger" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDeleteItem('projects', project.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Project Name"
                        value={project.name}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            projects: formData.projects.map(item => 
                              item.id === project.id ? { ...item, name: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <textarea
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        rows="2"
                        placeholder="Description"
                        value={project.description}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            projects: formData.projects.map(item => 
                              item.id === project.id ? { ...item, description: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      
                      {/* Tech Stack with chips */}
                      <div style={{ marginTop: '0.5rem' }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>Tech Stack</label>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.3rem' }}>
                          Type a technology and press Enter or click Add.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <input
                            className="form-input"
                            id={`tech-input-${project.id}`}
                            placeholder="e.g., React, Node.js, MongoDB"
                            style={{ flex: 1 }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.target;
                                const value = input.value.trim();
                                if (value) {
                                  const currentTech = Array.isArray(project.techStack) ? project.techStack : [];
                                  if (!currentTech.includes(value)) {
                                    const updatedFormData = {
                                      ...formData,
                                      projects: formData.projects.map(item => 
                                        item.id === project.id ? { ...item, techStack: [...currentTech, value] } : item
                                      )
                                    };
                                    setFormData(updatedFormData);
                                    input.value = '';
                                  } else {
                                    toast.error('This technology already exists');
                                  }
                                }
                              }
                            }}
                          />
                          <button
                            className="btn-primary"
                            style={{ padding: '0.3rem 1rem', whiteSpace: 'nowrap', fontSize: '0.85rem' }}
                            onClick={() => {
                              const input = document.getElementById(`tech-input-${project.id}`);
                              const value = input?.value?.trim();
                              if (value) {
                                const currentTech = Array.isArray(project.techStack) ? project.techStack : [];
                                if (!currentTech.includes(value)) {
                                  const updatedFormData = {
                                    ...formData,
                                    projects: formData.projects.map(item => 
                                      item.id === project.id ? { ...item, techStack: [...currentTech, value] } : item
                                    )
                                  };
                                  setFormData(updatedFormData);
                                  input.value = '';
                                } else {
                                  toast.error('This technology already exists');
                                }
                              }
                            }}
                          >
                            <i className="fas fa-plus"></i> Add
                          </button>
                        </div>
                        
                        {project.techStack && project.techStack.length > 0 && (
                          <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '0.3rem', 
                            marginTop: '0.3rem',
                            padding: '0.3rem',
                            background: 'var(--bg-color)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)'
                          }}>
                            {project.techStack.map((tech, i) => (
                              <span key={i} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: 'var(--primary-bg)',
                                color: 'var(--primary-color)',
                                padding: '0.1rem 0.5rem',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                border: '1px solid var(--primary-color)'
                              }}>
                                {tech}
                                <button
                                  onClick={() => {
                                    const updatedTech = project.techStack.filter((_, idx) => idx !== i);
                                    const updatedFormData = {
                                      ...formData,
                                      projects: formData.projects.map(item => 
                                        item.id === project.id ? { ...item, techStack: updatedTech } : item
                                      )
                                    };
                                    setFormData(updatedFormData);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary-color)',
                                    cursor: 'pointer',
                                    padding: '0 0 0 0.3rem',
                                    fontSize: '0.7rem',
                                    opacity: 0.7
                                  }}
                                  onMouseEnter={(e) => e.target.style.opacity = '1'}
                                  onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="GitHub URL"
                          value={project.githubUrl || ''}
                          onChange={(e) => {
                            const updatedFormData = {
                              ...formData,
                              projects: formData.projects.map(item => 
                                item.id === project.id ? { ...item, githubUrl: e.target.value } : item
                              )
                            };
                            setFormData(updatedFormData);
                          }}
                        />
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Live Demo URL"
                          value={project.liveUrl || ''}
                          onChange={(e) => {
                            const updatedFormData = {
                              ...formData,
                              projects: formData.projects.map(item => 
                                item.id === project.id ? { ...item, liveUrl: e.target.value } : item
                              )
                            };
                            setFormData(updatedFormData);
                          }}
                        />
                      </div>
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Project Image URL (optional)"
                        value={project.image || ''}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            projects: formData.projects.map(item => 
                              item.id === project.id ? { ...item, image: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => handleUpdate()}>
                    <i className="fas fa-save"></i> Save All Projects
                  </button>
                </div>
              )}

              {/* Skills Section */}
              {editingItem === 'skills' && (
                <div className="card">
                  <h4>Skills</h4>
                  <button className="btn-primary" style={{ marginBottom: '1rem' }} onClick={() => {
                    setNewItem({ name: '', category: 'Other', level: 50 });
                    setShowAddModal(true);
                  }}>
                    <i className="fas fa-plus"></i> Add Skill
                  </button>
                  {formData.skills?.map((skill) => (
                    <div key={skill.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{skill.name}</strong>
                        <button className="btn-danger" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDeleteItem('skills', skill.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        value={skill.name}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            skills: formData.skills.map(item => 
                              item.id === skill.id ? { ...item, name: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <select
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        value={skill.category || 'Other'}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            skills: formData.skills.map(item => 
                              item.id === skill.id ? { ...item, category: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      >
                        <option value="Cloud">Cloud</option>
                        <option value="Containers">Containers</option>
                        <option value="Infrastructure as Code">Infrastructure as Code</option>
                        <option value="CI/CD">CI/CD</option>
                        <option value="Programming">Programming</option>
                        <option value="Databases">Databases</option>
                        <option value="Monitoring">Monitoring</option>
                        <option value="System Admin">System Admin</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Level (0-100)"
                        value={skill.level || 50}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            skills: formData.skills.map(item => 
                              item.id === skill.id ? { ...item, level: parseInt(e.target.value) } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => handleUpdate()}>
                    <i className="fas fa-save"></i> Save All Skills
                  </button>
                </div>
              )}

              {/* Services Section */}
              {editingItem === 'services' && (
                <div className="card">
                  <h4>Services</h4>
                  <button className="btn-primary" style={{ marginBottom: '1rem' }} onClick={() => {
                    setNewItem({ name: '', description: '', icon: 'fa-check-circle' });
                    setShowAddModal(true);
                  }}>
                    <i className="fas fa-plus"></i> Add Service
                  </button>
                  {formData.services?.map((service) => (
                    <div key={service.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{service.name}</strong>
                        <button className="btn-danger" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDeleteItem('services', service.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        value={service.name}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            services: formData.services.map(item => 
                              item.id === service.id ? { ...item, name: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <textarea
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        rows="2"
                        value={service.description}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            services: formData.services.map(item => 
                              item.id === service.id ? { ...item, description: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Font Awesome icon class (e.g., fa-cloud)"
                        value={service.icon || ''}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            services: formData.services.map(item => 
                              item.id === service.id ? { ...item, icon: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => handleUpdate()}>
                    <i className="fas fa-save"></i> Save All Services
                  </button>
                </div>
              )}

              {/* Blog Section */}
              {editingItem === 'blog' && (
                <div className="card">
                  <h4>Blog Posts</h4>
                  <button className="btn-primary" style={{ marginBottom: '1rem' }} onClick={() => {
                    setNewItem({ 
                      title: '', 
                      date: new Date().toISOString().split('T')[0], 
                      excerpt: '', 
                      content: '',
                      url: '',
                      image: '',
                      tags: [], 
                      readTime: '5 min read',
                      platform: 'Medium'
                    });
                    setShowAddModal(true);
                  }}>
                    <i className="fas fa-plus"></i> Add Blog Post
                  </button>
                  {formData.blog?.map((post) => (
                    <div key={post.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{post.title}</strong>
                        <button className="btn-danger" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDeleteItem('blog', post.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Title"
                        value={post.title}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            blog: formData.blog.map(item => 
                              item.id === post.id ? { ...item, title: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        type="date"
                        value={post.date}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            blog: formData.blog.map(item => 
                              item.id === post.id ? { ...item, date: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <textarea
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        rows="2"
                        placeholder="Excerpt"
                        value={post.excerpt}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            blog: formData.blog.map(item => 
                              item.id === post.id ? { ...item, excerpt: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Blog URL (if published elsewhere)"
                        value={post.url || ''}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            blog: formData.blog.map(item => 
                              item.id === post.id ? { ...item, url: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          className="form-input"
                          style={{ flex: 1, marginTop: '0.5rem' }}
                          placeholder="Platform"
                          value={post.platform || ''}
                          onChange={(e) => {
                            const updatedFormData = {
                              ...formData,
                              blog: formData.blog.map(item => 
                                item.id === post.id ? { ...item, platform: e.target.value } : item
                              )
                            };
                            setFormData(updatedFormData);
                          }}
                        />
                        <input
                          className="form-input"
                          style={{ flex: 1, marginTop: '0.5rem' }}
                          placeholder="Read time"
                          value={post.readTime || ''}
                          onChange={(e) => {
                            const updatedFormData = {
                              ...formData,
                              blog: formData.blog.map(item => 
                                item.id === post.id ? { ...item, readTime: e.target.value } : item
                              )
                            };
                            setFormData(updatedFormData);
                          }}
                        />
                      </div>
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Tags (comma separated)"
                        value={post.tags?.join(', ') || ''}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          const updatedFormData = {
                            ...formData,
                            blog: formData.blog.map(item => 
                              item.id === post.id ? { ...item, tags } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Image URL"
                        value={post.image || ''}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            blog: formData.blog.map(item => 
                              item.id === post.id ? { ...item, image: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => handleUpdate()}>
                    <i className="fas fa-save"></i> Save All Blog Posts
                  </button>
                </div>
              )}

              {/* Certifications Section */}
              {editingItem === 'certifications' && (
                <div className="card">
                  <h4>Certifications</h4>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Upload certificate images or documents. Supported: JPG, PNG, PDF, WebP (Max 5MB)
                  </p>
                  <button className="btn-primary" style={{ marginBottom: '1rem' }} onClick={() => {
                    setNewItem({ 
                      name: '', 
                      issuer: '', 
                      date: '', 
                      credentialId: '', 
                      credentialUrl: '',
                      image: ''
                    });
                    setShowAddModal(true);
                  }}>
                    <i className="fas fa-plus"></i> Add Certification
                  </button>
                  {formData.certifications?.map((cert) => (
                    <div key={cert.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{cert.name}</strong>
                        <button className="btn-danger" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDeleteItem('certifications', cert.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Certification Name"
                        value={cert.name}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            certifications: formData.certifications.map(item => 
                              item.id === cert.id ? { ...item, name: e.target.value } : item
                            )
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Issuer"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updatedFormData = {
                              ...formData,
                              certifications: formData.certifications.map(item => 
                                item.id === cert.id ? { ...item, issuer: e.target.value } : item
                              )
                            };
                            setFormData(updatedFormData);
                          }}
                        />
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Date"
                          value={cert.date}
                          onChange={(e) => {
                            const updatedFormData = {
                              ...formData,
                              certifications: formData.certifications.map(item => 
                                item.id === cert.id ? { ...item, date: e.target.value } : item
                              )
                            };
                            setFormData(updatedFormData);
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Credential ID"
                          value={cert.credentialId || ''}
                          onChange={(e) => {
                            const updatedFormData = {
                              ...formData,
                              certifications: formData.certifications.map(item => 
                                item.id === cert.id ? { ...item, credentialId: e.target.value } : item
                              )
                            };
                            setFormData(updatedFormData);
                          }}
                        />
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Credential URL"
                          value={cert.credentialUrl || ''}
                          onChange={(e) => {
                            const updatedFormData = {
                              ...formData,
                              certifications: formData.certifications.map(item => 
                                item.id === cert.id ? { ...item, credentialUrl: e.target.value } : item
                              )
                            };
                            setFormData(updatedFormData);
                          }}
                        />
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <label className="form-label" style={{ fontSize: '0.85rem' }}>
                          <i className="fas fa-upload"></i> Certificate Image/Document
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <label style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 1rem',
                            background: 'var(--primary-color)',
                            color: 'white',
                            borderRadius: '40px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}>
                            <i className="fas fa-cloud-upload-alt"></i>
                            Choose File
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={async (e) => {
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
                                  const updatedFormData = {
                                    ...formData,
                                    certifications: formData.certifications.map(item => 
                                      item.id === cert.id ? { ...item, image: imageUrl } : item
                                    )
                                  };
                                  setFormData(updatedFormData);
                                  await handleUpdate(updatedFormData);
                                  toast.success('Certificate uploaded successfully!');
                                } catch (error) {
                                  toast.error('Failed to upload certificate');
                                } finally {
                                  setUploading(false);
                                }
                              }}
                              style={{ display: 'none' }}
                              disabled={uploading}
                            />
                          </label>
                          {cert.image && (
                            <>
                              <span style={{ fontSize: '0.85rem', color: '#22c55e' }}>
                                <i className="fas fa-check-circle"></i> File uploaded
                              </span>
                              <button className="btn-outline" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }} onClick={() => window.open(cert.image, '_blank')}>
                                <i className="fas fa-eye"></i> View
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {cert.image && (
                        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <img 
                            src={cert.image} 
                            alt={cert.name}
                            style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', objectFit: 'contain', background: 'white' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => handleUpdate()}>
                    <i className="fas fa-save"></i> Save All Certifications
                  </button>
                </div>
              )}

              {/* Education Section */}
              {editingItem === 'education' && (
                <div className="card">
                  <h4>Education</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                    Add multiple education entries. Each entry can have a certificate image.
                  </p>
                  
                  <button className="btn-primary" style={{ marginBottom: '1rem' }} onClick={() => {
                    setNewItem({ 
                      degree: '', 
                      institution: '', 
                      year: '', 
                      description: '',
                      grade: '',
                      location: '',
                      certificateImage: ''
                    });
                    setShowAddModal(true);
                  }}>
                    <i className="fas fa-plus"></i> Add Education
                  </button>

                  {formData.education && Array.isArray(formData.education) && formData.education.length > 0 ? (
                    formData.education.map((edu, index) => (
                      <div key={edu.id || index} style={{ 
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1rem',
                        background: 'var(--bg-color)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <strong>{edu.degree || 'Untitled Education'}</strong>
                          <button 
                            className="btn-danger" 
                            style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => handleDeleteItem('education', edu.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.8rem' }}>Degree</label>
                            <input
                              className="form-input"
                              value={edu.degree || ''}
                              onChange={(e) => {
                                const updatedFormData = {
                                  ...formData,
                                  education: formData.education.map(item => 
                                    item.id === edu.id ? { ...item, degree: e.target.value } : item
                                  )
                                };
                                setFormData(updatedFormData);
                              }}
                            />
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.8rem' }}>Institution</label>
                            <input
                              className="form-input"
                              value={edu.institution || ''}
                              onChange={(e) => {
                                const updatedFormData = {
                                  ...formData,
                                  education: formData.education.map(item => 
                                    item.id === edu.id ? { ...item, institution: e.target.value } : item
                                  )
                                };
                                setFormData(updatedFormData);
                              }}
                            />
                          </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.8rem' }}>Year</label>
                            <input
                              className="form-input"
                              value={edu.year || ''}
                              onChange={(e) => {
                                const updatedFormData = {
                                  ...formData,
                                  education: formData.education.map(item => 
                                    item.id === edu.id ? { ...item, year: e.target.value } : item
                                  )
                                };
                                setFormData(updatedFormData);
                              }}
                            />
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.8rem' }}>Grade (optional)</label>
                            <input
                              className="form-input"
                              placeholder="e.g., First Class, Magna Cum Laude"
                              value={edu.grade || ''}
                              onChange={(e) => {
                                const updatedFormData = {
                                  ...formData,
                                  education: formData.education.map(item => 
                                    item.id === edu.id ? { ...item, grade: e.target.value } : item
                                  )
                                };
                                setFormData(updatedFormData);
                              }}
                            />
                          </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.8rem' }}>Location (optional)</label>
                            <input
                              className="form-input"
                              placeholder="e.g., Online, London, UK"
                              value={edu.location || ''}
                              onChange={(e) => {
                                const updatedFormData = {
                                  ...formData,
                                  education: formData.education.map(item => 
                                    item.id === edu.id ? { ...item, location: e.target.value } : item
                                  )
                                };
                                setFormData(updatedFormData);
                              }}
                            />
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.8rem' }}>Certificate Image</label>
                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                              <input
                                className="form-input"
                                placeholder="Image URL"
                                value={edu.certificateImage || ''}
                                onChange={(e) => {
                                  const updatedFormData = {
                                    ...formData,
                                    education: formData.education.map(item => 
                                      item.id === edu.id ? { ...item, certificateImage: e.target.value } : item
                                    )
                                  };
                                  setFormData(updatedFormData);
                                }}
                              />
                              <label className="btn-primary" style={{ cursor: 'pointer', padding: '0.3rem 0.8rem', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                                <i className="fas fa-upload"></i>
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  style={{ display: 'none' }}
                                  onChange={async (e) => {
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
                                      const updatedFormData = {
                                        ...formData,
                                        education: formData.education.map(item => 
                                          item.id === edu.id ? { ...item, certificateImage: imageUrl } : item
                                        )
                                      };
                                      setFormData(updatedFormData);
                                      await handleUpdate(updatedFormData);
                                      toast.success('Certificate uploaded!');
                                    } catch (error) {
                                      toast.error('Upload failed');
                                    } finally {
                                      setUploading(false);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            {edu.certificateImage && (
                              <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: '#22c55e' }}>
                                <i className="fas fa-check-circle"></i> File uploaded
                                <button 
                                  className="btn-outline" 
                                  style={{ padding: '0.1rem 0.5rem', fontSize: '0.7rem', marginLeft: '0.3rem' }}
                                  onClick={() => window.open(edu.certificateImage, '_blank')}
                                >
                                  <i className="fas fa-eye"></i> View
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div style={{ marginTop: '0.5rem' }}>
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>Description</label>
                          <textarea
                            className="form-input"
                            rows="2"
                            value={edu.description || ''}
                            onChange={(e) => {
                              const updatedFormData = {
                                ...formData,
                                education: formData.education.map(item => 
                                  item.id === edu.id ? { ...item, description: e.target.value } : item
                                )
                              };
                              setFormData(updatedFormData);
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ 
                      padding: '2rem',
                      textAlign: 'center',
                      border: '2px dashed var(--border-color)',
                      borderRadius: '12px',
                      color: 'var(--text-light)'
                    }}>
                      <i className="fas fa-graduation-cap" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                      No education entries yet. Click "Add Education" to add your first entry!
                    </div>
                  )}
                  
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => handleUpdate()}>
                    <i className="fas fa-save"></i> Save All Education
                  </button>
                </div>
              )}

              {/* Contact Fields Section */}
              {editingItem === 'contactFields' && (
                <div className="card">
                  <h4>Contact Fields</h4>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Add any contact field with custom icon. Supports Font Awesome icons.
                  </p>
                  
                  <button className="btn-primary" style={{ marginBottom: '1rem' }} onClick={() => {
                    setNewItem({ 
                      label: '', 
                      value: '', 
                      icon: 'fa-link', 
                      type: 'url'
                    });
                    setShowAddModal(true);
                  }}>
                    <i className="fas fa-plus"></i> Add Contact Field
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {formData.contactFields?.map((field) => (
                      <div key={field.id} style={{ 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '12px', 
                        padding: '1rem',
                        background: 'var(--bg-color)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className={`fas ${field.icon}`} style={{ color: '#2563eb' }}></i>
                            <strong>{field.label}</strong>
                          </div>
                          <button className="btn-danger" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }} 
                            onClick={() => handleDeleteItem('contactFields', field.id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                        
                        <input
                          className="form-input"
                          style={{ marginBottom: '0.5rem' }}
                          placeholder="Label"
                          value={field.label}
                          onChange={(e) => {
                            const updatedFormData = {
                              ...formData,
                              contactFields: formData.contactFields.map(item => 
                                item.id === field.id ? { ...item, label: e.target.value } : item
                              )
                            };
                            setFormData(updatedFormData);
                          }}
                        />
                        <input
                          className="form-input"
                          style={{ marginBottom: '0.5rem' }}
                          placeholder="Value"
                          value={field.value}
                          onChange={(e) => {
                            const updatedFormData = {
                              ...formData,
                              contactFields: formData.contactFields.map(item => 
                                item.id === field.id ? { ...item, value: e.target.value } : item
                              )
                            };
                            setFormData(updatedFormData);
                          }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            className="form-input"
                            style={{ flex: 1 }}
                            placeholder="Icon (e.g., fa-github)"
                            value={field.icon}
                            onChange={(e) => {
                              const updatedFormData = {
                                ...formData,
                                contactFields: formData.contactFields.map(item => 
                                  item.id === field.id ? { ...item, icon: e.target.value } : item
                                )
                              };
                              setFormData(updatedFormData);
                            }}
                          />
                          <select
                            className="form-input"
                            style={{ flex: 0.8 }}
                            value={field.type}
                            onChange={(e) => {
                              const updatedFormData = {
                                ...formData,
                                contactFields: formData.contactFields.map(item => 
                                  item.id === field.id ? { ...item, type: e.target.value } : item
                                )
                              };
                              setFormData(updatedFormData);
                            }}
                          >
                            <option value="url">URL</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="address">Address</option>
                            <option value="text">Text</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => handleUpdate()}>
                    <i className="fas fa-save"></i> Save All Contact Fields
                  </button>
                </div>
              )}

              {/* Hire Section */}
              {editingItem === 'hire' && (
                <div className="card">
                  <h4>Hire Me Information</h4>
                  {['salaryExpectation', 'noticePeriod', 'availability', 'preferredWork'].map(field => (
                    <div key={field} style={{ marginBottom: '1rem' }}>
                      <label className="form-label">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                      <input
                        className="form-input"
                        value={formData.hire?.[field] || ''}
                        onChange={(e) => {
                          const updatedFormData = {
                            ...formData,
                            hire: { ...formData.hire, [field]: e.target.value }
                          };
                          setFormData(updatedFormData);
                        }}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" onClick={() => handleUpdate()}>
                    <i className="fas fa-save"></i> Save Hire Info
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Section coming soon...</div>;
    }
  };

  return (
    <div style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1><i className="fas fa-dashboard" style={{ color: '#2563eb' }}></i> Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: '#64748b' }}>👋 Welcome, {user?.name}</span>
          <button className="btn-danger" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['overview', 'messages', 'content'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'btn-primary' : 'btn-outline'}
            onClick={() => setActiveTab(tab)}
            style={{ padding: '0.5rem 1.5rem' }}
          >
            <i className={`fas ${tab === 'overview' ? 'fa-chart-pie' : tab === 'messages' ? 'fa-envelope' : 'fa-edit'}`}></i>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        {renderTab()}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New {editingItem?.slice(0, -1) || 'Item'}</h3>
            {Object.keys(newItem).map(key => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                {key === 'techStack' || key === 'tags' ? (
                  <input
                    className="form-input"
                    placeholder="Comma separated values"
                    value={Array.isArray(newItem[key]) ? newItem[key].join(', ') : ''}
                    onChange={(e) => setNewItem({ ...newItem, [key]: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  />
                ) : key === 'description' || key === 'content' ? (
                  <textarea
                    className="form-input"
                    rows="3"
                    value={newItem[key] || ''}
                    onChange={(e) => setNewItem({ ...newItem, [key]: e.target.value })}
                  />
                ) : key === 'type' ? (
                  <select
                    className="form-input"
                    value={newItem[key] || 'url'}
                    onChange={(e) => setNewItem({ ...newItem, [key]: e.target.value })}
                  >
                    <option value="url">URL</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="address">Address</option>
                    <option value="text">Text</option>
                  </select>
                ) : (
                  <input
                    className="form-input"
                    value={newItem[key] || ''}
                    onChange={(e) => setNewItem({ ...newItem, [key]: e.target.value })}
                  />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={() => handleAddItem(editingItem)}>
                <i className="fas fa-plus"></i> Add
              </button>
              <button className="btn-outline" onClick={() => {
                setShowAddModal(false);
                setNewItem({});
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
