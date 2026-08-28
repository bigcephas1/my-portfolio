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
        image: '',
        imageFile: null
      });
      setShowAddModal(true);
    }}>
      <i className="fas fa-plus"></i> Add Certification
    </button>
    {formData.certifications?.map((cert) => (
      <div key={cert.id} style={{ 
        borderBottom: '1px solid var(--border-color)', 
        padding: '1rem 0',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1 }}>
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
          
          {/* File Upload for Certificate Image */}
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
                <span style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--text-light)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <i className="fas fa-check-circle" style={{ color: '#22c55e' }}></i>
                  File uploaded
                </span>
              )}
              {cert.image && (
                <button
                  className="btn-outline"
                  style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }}
                  onClick={() => window.open(cert.image, '_blank')}
                >
                  <i className="fas fa-eye"></i> View
                </button>
              )}
            </div>
          </div>
          
          {/* Preview uploaded image */}
          {cert.image && (
            <div style={{ 
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: 'var(--bg-color)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.3rem' }}>
                <i className="fas fa-image"></i> Preview:
              </div>
              <img 
                src={cert.image} 
                alt={cert.name}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '150px', 
                  borderRadius: '8px',
                  objectFit: 'contain',
                  background: 'white'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>
    ))}
    <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={handleUpdate}>
      <i className="fas fa-save"></i> Save All Certifications
    </button>
  </div>
)}
