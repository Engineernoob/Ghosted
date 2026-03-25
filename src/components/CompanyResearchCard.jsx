import { useEffect, useState } from 'react';

const cardStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '14px',
  padding: '1rem'
};

export default function CompanyResearchCard({ application }) {
  const [state, setState] = useState({ loading: false, error: '', summary: '', highlights: [] });

  useEffect(() => {
    let ignore = false;

    const loadResearch = async () => {
      if (!application?.company) return;
      setState({ loading: true, error: '', summary: '', highlights: [] });
      try {
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(application.company)}`;
        const response = await fetch(wikiUrl);
        if (!response.ok) throw new Error('No quick company profile found.');
        const data = await response.json();
        if (ignore) return;

        const extract = data.extract || 'No summary available yet.';
        const highlights = [
          data.description ? `What they are: ${data.description}` : null,
          data.content_urls?.desktop?.page ? `Research link: ${data.content_urls.desktop.page}` : null,
          application.companyDomain ? `Website: https://${application.companyDomain}` : null
        ].filter(Boolean);

        setState({ loading: false, error: '', summary: extract, highlights });
      } catch (error) {
        if (ignore) return;
        setState({
          loading: false,
          error: error.message,
          summary: 'Tip: add exact legal company name or domain for richer research context.',
          highlights: application.companyDomain ? [`Website: https://${application.companyDomain}`] : []
        });
      }
    };

    loadResearch();
    return () => {
      ignore = true;
    };
  }, [application]);

  if (!application) return null;

  return (
    <aside style={cardStyle}>
      <h3 style={{ marginTop: 0, marginBottom: 6 }}>Company Research Card</h3>
      <p style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
        Agentic snapshot for <strong style={{ color: 'var(--text-primary)' }}>{application.company}</strong>
      </p>

      {state.loading ? <p>Researching public data…</p> : <p style={{ lineHeight: 1.5 }}>{state.summary}</p>}
      {state.error && <p style={{ color: 'var(--cold)' }}>{state.error}</p>}

      <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
        {state.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
