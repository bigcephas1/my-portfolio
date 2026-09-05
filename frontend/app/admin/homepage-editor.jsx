{editingItem === 'homepage' && (
  <div className="card">
    <h4>Homepage Content</h4>
    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
      Edit your homepage content. Use the rich text editor to format your text.
    </p>

    <div style={{ marginBottom: '1rem' }}>
      <label className="form-label">Hero Title</label>
      <input
        className="form-input"
        value={formData.homepage?.heroTitle || ''}
        onChange={(e) => {
          const updatedFormData = {
            ...formData,
            homepage: { ...formData.homepage, heroTitle: e.target.value }
          };
          setFormData(updatedFormData);
        }}
        placeholder="Your name"
      />
    </div>

    <div style={{ marginBottom: '1rem' }}>
      <label className="form-label">Hero Subtitle</label>
      <input
        className="form-input"
        value={formData.homepage?.heroSubtitle || ''}
        onChange={(e) => {
          const updatedFormData = {
            ...formData,
            homepage: { ...formData.homepage, heroSubtitle: e.target.value }
          };
          setFormData(updatedFormData);
        }}
        placeholder="e.g., DevSecOps · Cloud · Platform Engineer"
      />
    </div>

    <div style={{ marginBottom: '1rem' }}>
      <label className="form-label">Intro</label>
      <RichTextEditor
        value={formData.homepage?.intro || ''}
        onChange={(html) => {
          const updatedFormData = {
            ...formData,
            homepage: { ...formData.homepage, intro: html }
          };
          setFormData(updatedFormData);
        }}
        placeholder="Write your introduction..."
      />
    </div>

    <div style={{ marginBottom: '1rem' }}>
      <label className="form-label">Professional Summary</label>
      <RichTextEditor
        value={formData.homepage?.summary || ''}
        onChange={(html) => {
          const updatedFormData = {
            ...formData,
            homepage: { ...formData.homepage, summary: html }
          };
          setFormData(updatedFormData);
        }}
        placeholder="Write your professional summary..."
      />
    </div>

    <div style={{ marginBottom: '1rem' }}>
      <label className="form-label">Core Competencies</label>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.3rem' }}>
        Enter each competency on a new line
      </p>
      <textarea
        className="form-input"
        rows="5"
        value={Array.isArray(formData.homepage?.competencies) ? formData.homepage.competencies.join('\n') : ''}
        onChange={(e) => {
          const competencies = e.target.value
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean);
          const updatedFormData = {
            ...formData,
            homepage: { ...formData.homepage, competencies }
          };
          setFormData(updatedFormData);
        }}
        placeholder="Cloud Infrastructure Engineering&#10;AWS Architecture&#10;Platform Engineering"
      />
    </div>

    <button className="btn-primary" onClick={() => handleUpdate()}>
      <i className="fas fa-save"></i> Save Homepage
    </button>
  </div>
)}
