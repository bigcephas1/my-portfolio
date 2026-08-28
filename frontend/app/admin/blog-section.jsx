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
        
        {/* Image Upload for Blog */}
        <div style={{ marginTop: '0.5rem' }}>
          <label className="form-label" style={{ fontSize: '0.85rem' }}>
            <i className="fas fa-image"></i> Blog Cover Image
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.3rem 0.8rem',
              background: 'var(--primary-color)',
              color: 'white',
              borderRadius: '40px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-cloud-upload-alt"></i>
              Upload Image
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
                    handleUpdateItem('blog', post.id, 'image', imageUrl);
                    toast.success('Image uploaded successfully!');
                  } catch (error) {
                    toast.error('Failed to upload image');
                  } finally {
                    setUploading(false);
                  }
                }}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>
            {post.image && (
              <>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  <i className="fas fa-check-circle" style={{ color: '#22c55e' }}></i> Image uploaded
                </span>
                <button
                  className="btn-outline"
                  style={{ padding: '0.1rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={() => window.open(post.image, '_blank')}
                >
                  <i className="fas fa-eye"></i> Preview
                </button>
              </>
            )}
          </div>
          {post.image && (
            <div style={{ marginTop: '0.3rem' }}>
              <img 
                src={post.image} 
                alt={post.title}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100px', 
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
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
