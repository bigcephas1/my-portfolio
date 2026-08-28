// Replace the contact section in the admin dashboard with this:

{editingItem === 'contact' && (
  <div className="card">
    <h4>Contact Information</h4>
    <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1rem' }}>
      Add your social media profiles. Only fields with values will appear on the contact page.
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {['email', 'phone', 'github', 'linkedin', 'twitter', 'youtube', 'instagram', 'facebook', 'tiktok', 'website', 'address'].map(field => (
        <div key={field} style={{ marginBottom: '1rem' }}>
          <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            className="form-input"
            placeholder={field === 'address' ? 'Your address' : `Your ${field} URL or username`}
            value={formData.contact?.[field] || ''}
            onChange={(e) => setFormData({
              ...formData,
              contact: { ...formData.contact, [field]: e.target.value }
            })}
          />
        </div>
      ))}
    </div>
    <button className="btn-primary" onClick={handleUpdate}>
      <i className="fas fa-save"></i> Save Contact Info
    </button>
  </div>
)}
