{editingItem === 'contactFields' && (
  <div className="card">
    <h4>Contact Fields</h4>
    <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1rem' }}>
      Add any contact field with custom icon. Supports Font Awesome icons (e.g., fa-envelope, fa-github, fa-twitter, fa-phone, fa-map-pin)
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
            <input
              className="form-input"
              style={{ flex: 1 }}
              placeholder="Icon (e.g., fa-github)"
              value={field.icon}
              onChange={(e) => handleUpdateItem('contactFields', field.id, 'icon', e.target.value)}
            />
            <select
              className="form-input"
              style={{ flex: 1 }}
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
