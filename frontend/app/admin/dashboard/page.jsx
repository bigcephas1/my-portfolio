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

  useEffect(() => {
    fetchPortfolio();
    fetchContacts();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(`${API_URL}/portfolio`);
      setPortfolio(res.data.data);
      setFormData(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch portfolio data');
    } finally {
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

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API_URL}/portfolio`, formData);
      setPortfolio(res.data.data);
      toast.success('Portfolio updated successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to update portfolio');
      return false;
    }
  };

  const handleImageUpload = async (e) => {
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
      setFormData(prev => ({
        ...prev,
        avatar: imageUrl,
        about: { ...prev.about, profileImage: imageUrl }
      }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleAddItem = async (section) => {
    const item = {
      id: Date.now(),
      ...newItem
    };
    
    const updatedSection = [...(formData[section] || []), item];
    const updatedFormData = { ...formData, [section]: updatedSection };
    setFormData(updatedFormData);
    setShowAddModal(false);
    setNewItem({});
    await handleUpdate();
    toast.success(`${section.slice(0, -1)} added successfully!`);
  };

  const handleDeleteItem = async (section, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const updatedSection = formData[section].filter(item => item.id !== id);
    const updatedFormData = { ...formData, [section]: updatedSection };
    setFormData(updatedFormData);
    await handleUpdate();
    toast.success('Item deleted successfully!');
  };

  const handleUpdateItem = async (section, id, field, value) => {
    const updatedSection = formData[section].map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    const updatedFormData = { ...formData, [section]: updatedSection };
    setFormData(updatedFormData);
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

  // Common icon suggestions for contact fields
  const iconSuggestions = [
    'fa-envelope', 'fa-phone', 'fa-github', 'fa-linkedin', 'fa-twitter', 
    'fa-youtube', 'fa-instagram', 'fa-facebook', 'fa-tiktok', 'fa-twitch',
    'fa-discord', 'fa-reddit', 'fa-medium', 'fa-dev', 'fa-hashnode',
    'fa-globe', 'fa-map-pin', 'fa-whatsapp', 'fa-telegram', 'fa-signal'
  ];

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
                {['avatar', 'about', 'experience', 'projects', 'skills', 'services', 'blog', 'certifications', 'contactFields', 'hire'].map(section => (
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
                  <h4>Profile Image</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    <div>
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-user" style={{ fontSize: '2rem', color: '#64748b' }}></i>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                        <i className="fas fa-upload"></i> {uploading ? 'Uploading...' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                          disabled={uploading}
                        />
                      </label>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                        Supported: JPG, PNG, GIF, WebP (Max 5MB)
                      </p>
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
                      onChange={(e) => setFormData({
                        ...formData,
                        about: { ...formData.about, bio: e.target.value }
                      })}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Experience Summary</label>
                    <textarea
                      className="form-input"
                      rows="2"
                      value={formData.about?.experience || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        about: { ...formData.about, experience: e.target.value }
                      })}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Philosophy</label>
                    <input
                      className="form-input"
                      value={formData.about?.philosophy || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        about: { ...formData.about, philosophy: e.target.value }
                      })}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Interests</label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.3rem' }}>
                      Enter interests separated by commas
                    </p>
                    <input
                      className="form-input"
                      value={Array.isArray(formData.about?.interests) ? formData.about.interests.join(', ') : ''}
                      onChange={(e) => {
                        const interests = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setFormData({
                          ...formData,
                          about: { ...formData.about, interests }
                        });
                      }}
                      placeholder="e.g., Cloud Computing, Kubernetes, DevOps Culture, Open Source"
                    />
                    {formData.about?.interests && formData.about.interests.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                        {formData.about.interests.map((interest, i) => (
                          <span key={i} style={{
                            background: 'var(--primary-bg)',
                            color: 'var(--primary-color)',
                            padding: '0.1rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.8rem'
                          }}>
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="btn-primary" onClick={handleUpdate}>
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
                        onChange={(e) => handleUpdateItem('experience', exp.id, 'company', e.target.value)}
                      />
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Period (e.g., Jan 2022 - Present)"
                        value={exp.period}
                        onChange={(e) => handleUpdateItem('experience', exp.id, 'period', e.target.value)}
                      />
                      <textarea
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        rows="3"
                        placeholder="Description"
                        value={exp.description}
                        onChange={(e) => handleUpdateItem('experience', exp.id, 'description', e.target.value)}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={handleUpdate}>
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
                        onChange={(e) => handleUpdateItem('projects', project.id, 'name', e.target.value)}
                      />
                      <textarea
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        rows="2"
                        placeholder="Description"
                        value={project.description}
                        onChange={(e) => handleUpdateItem('projects', project.id, 'description', e.target.value)}
                      />
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Tech Stack (comma separated, e.g., React, Node.js, MongoDB)"
                        value={project.techStack?.join(', ') || ''}
                        onChange={(e) => handleUpdateItem('projects', project.id, 'techStack', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="GitHub URL"
                          value={project.githubUrl || ''}
                          onChange={(e) => handleUpdateItem('projects', project.id, 'githubUrl', e.target.value)}
                        />
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Live Demo URL"
                          value={project.liveUrl || ''}
                          onChange={(e) => handleUpdateItem('projects', project.id, 'liveUrl', e.target.value)}
                        />
                      </div>
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Project Image URL (optional)"
                        value={project.image || ''}
                        onChange={(e) => handleUpdateItem('projects', project.id, 'image', e.target.value)}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={handleUpdate}>
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
                        onChange={(e) => handleUpdateItem('skills', skill.id, 'name', e.target.value)}
                      />
                      <select
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        value={skill.category || 'Other'}
                        onChange={(e) => handleUpdateItem('skills', skill.id, 'category', e.target.value)}
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
                        onChange={(e) => handleUpdateItem('skills', skill.id, 'level', parseInt(e.target.value))}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={handleUpdate}>
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
                        onChange={(e) => handleUpdateItem('services', service.id, 'name', e.target.value)}
                      />
                      <textarea
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        rows="2"
                        value={service.description}
                        onChange={(e) => handleUpdateItem('services', service.id, 'description', e.target.value)}
                      />
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Font Awesome icon class (e.g., fa-cloud)"
                        value={service.icon || ''}
                        onChange={(e) => handleUpdateItem('services', service.id, 'icon', e.target.value)}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={handleUpdate}>
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
                        onChange={(e) => handleUpdateItem('blog', post.id, 'title', e.target.value)}
                      />
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        type="date"
                        value={post.date}
                        onChange={(e) => handleUpdateItem('blog', post.id, 'date', e.target.value)}
                      />
                      <textarea
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        rows="2"
                        placeholder="Excerpt"
                        value={post.excerpt}
                        onChange={(e) => handleUpdateItem('blog', post.id, 'excerpt', e.target.value)}
                      />
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Blog URL (if published elsewhere)"
                        value={post.url || ''}
                        onChange={(e) => handleUpdateItem('blog', post.id, 'url', e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          className="form-input"
                          style={{ flex: 1, marginTop: '0.5rem' }}
                          placeholder="Platform (e.g., Medium, Dev.to)"
                          value={post.platform || ''}
                          onChange={(e) => handleUpdateItem('blog', post.id, 'platform', e.target.value)}
                        />
                        <input
                          className="form-input"
                          style={{ flex: 1, marginTop: '0.5rem' }}
                          placeholder="Read time (e.g., 5 min read)"
                          value={post.readTime || ''}
                          onChange={(e) => handleUpdateItem('blog', post.id, 'readTime', e.target.value)}
                        />
                      </div>
                      <input
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                        placeholder="Tags (comma separated)"
                        value={post.tags?.join(', ') || ''}
                        onChange={(e) => handleUpdateItem('blog', post.id, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={handleUpdate}>
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
                        onChange={(e) => handleUpdateItem('certifications', cert.id, 'name', e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Issuer"
                          value={cert.issuer}
                          onChange={(e) => handleUpdateItem('certifications', cert.id, 'issuer', e.target.value)}
                        />
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Date (e.g., 2024)"
                          value={cert.date}
                          onChange={(e) => handleUpdateItem('certifications', cert.id, 'date', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Credential ID"
                          value={cert.credentialId || ''}
                          onChange={(e) => handleUpdateItem('certifications', cert.id, 'credentialId', e.target.value)}
                        />
                        <input
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Credential URL"
                          value={cert.credentialUrl || ''}
                          onChange={(e) => handleUpdateItem('certifications', cert.id, 'credentialUrl', e.target.value)}
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
                            fontSize: '0.85rem',
                            transition: 'all 0.3s ease'
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
                                  handleUpdateItem('certifications', cert.id, 'image', imageUrl);
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
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                <i className="fas fa-check-circle" style={{ color: '#22c55e' }}></i>
                                File uploaded
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
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.3rem' }}>
                            <i className="fas fa-image"></i> Preview:
                          </div>
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
                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={handleUpdate}>
                    <i className="fas fa-save"></i> Save All Certifications
                  </button>
                </div>
              )}

              {/* Contact Fields Section - Dynamic */}
              {editingItem === 'contactFields' && (
                <div className="card">
                  <h4>Contact Fields</h4>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Add any contact field with custom icon. Supports Font Awesome icons.
                    <br />
                    <strong>Common icons:</strong> fa-envelope, fa-phone, fa-github, fa-linkedin, fa-twitter, fa-youtube, fa-instagram, fa-facebook, fa-tiktok, fa-discord, fa-medium, fa-dev, fa-hashnode, fa-whatsapp, fa-telegram, fa-globe, fa-map-pin
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
                          placeholder="Label (e.g., GitHub, Twitter)"
                          value={field.label}
                          onChange={(e) => handleUpdateItem('contactFields', field.id, 'label', e.target.value)}
                        />
                        <input
                          className="form-input"
                          style={{ marginBottom: '0.5rem' }}
                          placeholder="Value (e.g., username or URL)"
                          value={field.value}
                          onChange={(e) => handleUpdateItem('contactFields', field.id, 'value', e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <input
                              className="form-input"
                              placeholder="Icon (e.g., fa-github)"
                              value={field.icon}
                              onChange={(e) => handleUpdateItem('contactFields', field.id, 'icon', e.target.value)}
                            />
                          </div>
                          <select
                            className="form-input"
                            style={{ flex: 0.8 }}
                            value={field.type}
                            onChange={(e) => handleUpdateItem('contactFields', field.id, 'type', e.target.value)}
                          >
                            <option value="url">URL</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="address">Address</option>
                            <option value="text">Text</option>
                          </select>
                        </div>
                        <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                          <i className="fas fa-info-circle"></i> Type: {field.type}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={handleUpdate}>
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
                        onChange={(e) => setFormData({
                          ...formData,
                          hire: { ...formData.hire, [field]: e.target.value }
                        })}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" onClick={handleUpdate}>
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
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
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
                ) : key === 'description' || key === 'content' || key === 'bio' ? (
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
