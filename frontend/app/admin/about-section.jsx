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

    {/* Interests Section - Tags/Chips Approach */}
    <div style={{ marginBottom: '1rem' }}>
      <label className="form-label">Interests</label>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.3rem' }}>
        Type an interest and press Enter or click Add. Click the × on any tag to remove it.
      </p>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          className="form-input"
          id="interest-input"
          placeholder="e.g., Cloud Computing, Kubernetes, Machine Learning"
          style={{ flex: 1 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target;
              const value = input.value.trim();
              if (value) {
                const currentInterests = Array.isArray(formData.about?.interests) ? formData.about.interests : [];
                if (!currentInterests.includes(value)) {
                  setFormData({
                    ...formData,
                    about: { 
                      ...formData.about, 
                      interests: [...currentInterests, value] 
                    }
                  });
                  input.value = '';
                } else {
                  toast.error('This interest already exists');
                }
              }
            }
          }}
        />
        <button
          className="btn-primary"
          style={{ padding: '0.3rem 1.5rem', whiteSpace: 'nowrap' }}
          onClick={() => {
            const input = document.getElementById('interest-input');
            const value = input?.value?.trim();
            if (value) {
              const currentInterests = Array.isArray(formData.about?.interests) ? formData.about.interests : [];
              if (!currentInterests.includes(value)) {
                setFormData({
                  ...formData,
                  about: { 
                    ...formData.about, 
                    interests: [...currentInterests, value] 
                  }
                });
                input.value = '';
              } else {
                toast.error('This interest already exists');
              }
            }
          }}
        >
          <i className="fas fa-plus"></i> Add
        </button>
      </div>

      {/* Display interests as chips/tags */}
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
              border: '1px solid var(--primary-color)',
              transition: 'all 0.2s'
            }}>
              {interest}
              <button
                onClick={() => {
                  const updatedInterests = formData.about.interests.filter((_, idx) => idx !== i);
                  setFormData({
                    ...formData,
                    about: { ...formData.about, interests: updatedInterests }
                  });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  padding: '0 0 0 0.3rem',
                  fontSize: '0.7rem',
                  opacity: 0.7,
                  transition: 'opacity 0.2s'
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
          <i className="fas fa-info-circle"></i> No interests added yet. Add your first interest above!
        </div>
      )}
    </div>

    <button className="btn-primary" onClick={handleUpdate}>
      <i className="fas fa-save"></i> Save About
    </button>
  </div>
)}
