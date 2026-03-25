export default function EmailModal({ application, emailBody, loading, error, onClose, onGenerate }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <h3>AI Follow-up for {application.company}</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: 0 }}>
          Role: {application.role}
        </p>
        {error && <p style={{ color: 'var(--ghosted)' }}>{error}</p>}
        <textarea readOnly value={emailBody} rows={10} style={{ width: '100%', ...(!emailBody ? { opacity: 0.8 } : {}) }} />
        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>Close</button>
          <button type="button" className="primary-btn" onClick={onGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Follow-up'}
          </button>
        </div>
      </div>
    </div>
  );
}
