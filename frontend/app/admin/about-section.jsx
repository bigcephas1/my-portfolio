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
