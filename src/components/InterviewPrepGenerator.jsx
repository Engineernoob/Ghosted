import { useState } from 'react';
import { generateInterviewPrep } from '../services/openai';

const cardStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '14px',
  padding: '1rem'
};

export default function InterviewPrepGenerator({ application, ghostMeta }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prep, setPrep] = useState('');

  const onGenerate = async () => {
    if (!application) return;
    setLoading(true);
    setError('');
    try {
      const result = await generateInterviewPrep(application, ghostMeta);
      setPrep(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!application) return null;

  return (
    <aside style={cardStyle}>
      <h3 style={{ marginTop: 0, marginBottom: 6 }}>Interview Prep Generator</h3>
      <p style={{ marginTop: 0, color: 'var(--text-secondary)' }}>
        Most impressive demo moment: generate a targeted prep brief instantly.
      </p>
      <button type="button" className="primary-btn" onClick={onGenerate} disabled={loading}>
        {loading ? 'Generating prep...' : 'Generate Prep Brief'}
      </button>
      {error && <p style={{ color: 'var(--ghosted)' }}>{error}</p>}
      {prep && <textarea readOnly rows={12} style={{ width: '100%', marginTop: 12 }} value={prep} />}
    </aside>
  );
}
