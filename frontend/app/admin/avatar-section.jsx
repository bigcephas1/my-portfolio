{editingItem === 'avatar' && (
  <div className="card" style={{ marginBottom: '1rem' }}>
    <h4>Profile Images Gallery</h4>
    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
      Upload multiple images for the carousel. They will auto-rotate on the homepage.
      You can reorder by dragging (coming soon).
    </p>
    
    {/* Upload Button */}
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
              const res = await axios.post(`${API_URL}/portfolio/upload`, formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
              
              // Refresh portfolio data
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
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
        Supported: JPG, PNG, GIF, WebP (Max 5MB each)
      </p>
    </div>

    {/* Gallery Display */}
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

    {/* Avatar (primary image) */}
    <div style={{ 
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid var(--border-color)'
    }}>
      <h5>Primary Avatar</h5>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
        This image appears in the header and as the main profile picture.
      </p>
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
                  
                  // Update avatar
                  const updatedFormData = { ...formData, avatar: imageUrl };
                  setFormData(updatedFormData);
                  await axios.put(`${API_URL}/portfolio`, updatedFormData);
                  await fetchPortfolio();
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
                await axios.put(`${API_URL}/portfolio`, updatedFormData);
                await fetchPortfolio();
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
