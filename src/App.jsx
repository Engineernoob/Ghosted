import { useEffect, useMemo, useState } from 'react';
import AddApplicationModal from './components/AddApplicationModal';
import CompanyResearchCard from './components/CompanyResearchCard';
import Dashboard from './components/Dashboard';
import EmailModal from './components/EmailModal';
import InterviewPrepGenerator from './components/InterviewPrepGenerator';
import SmartTimingAdvisor from './components/SmartTimingAdvisor';
import Stats from './components/Stats';
import { useApplications } from './hooks/useApplications';
import { useGhostDetection } from './hooks/useGhostDetection';
import { generateFollowUpEmail } from './services/openai';
import { baseStyles } from './styles/theme';

const shellStyles = `
.app-shell { max-width: 1180px; margin: 0 auto; padding: 2rem 1rem 3rem; }
.brand { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.2rem; }
.brand h1 { margin: 0; font-size: 1.8rem; }
.brand p { margin: 0.3rem 0 0; color: var(--text-secondary); }
.primary-btn, .secondary-btn { border: 0; border-radius: 10px; padding: 0.55rem 0.8rem; cursor: pointer; transition: transform 0.2s ease, opacity 0.2s ease; }
.primary-btn { background: var(--accent-gradient); color: #fff; }
.secondary-btn { background: #191927; color: var(--text-primary); }
.primary-btn:hover, .secondary-btn:hover { transform: translateY(-1px); }
.app-card {
  background: linear-gradient(180deg, #141422, #10101a);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 0.9rem;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.app-card:hover { transform: translateY(-2px); border-color: #4f46e5; }
.status-badge { border-radius: 999px; font-size: 12px; padding: 0.2rem 0.5rem; text-transform: capitalize; }
.meter-track { height: 8px; margin-top: 6px; border-radius: 999px; background: #202033; overflow: hidden; }
.meter-fill { height: 100%; transition: width 0.35s ease; }
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(2, 4, 8, 0.7);
  display: grid; place-items: center; padding: 1rem; z-index: 50;
}
.modal-panel {
  width: min(640px, 100%); background: var(--surface);
  border: 1px solid var(--border); border-radius: 16px; padding: 1rem;
}
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
.form-grid textarea, .form-grid label { grid-column: 1 / -1; color: var(--text-secondary); display: grid; gap: 0.25rem; font-size: 14px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 1rem; }
.dashboard-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1rem; align-items: start; }
.side-rail { display: grid; gap: 0.8rem; }
@media (max-width: 980px) { .dashboard-grid { grid-template-columns: 1fr; } }
@media (max-width: 720px) { .form-grid { grid-template-columns: 1fr; } }
`;

function matchesFilter(app, ghostBand, filter) {
  if (filter === 'all') return true;
  if (filter === 'interviewing') return app.status === 'interviewing';
  if (filter === 'ghosted') return ghostBand === 'ghosted';
  if (filter === 'cold') return ghostBand === 'cold' || ghostBand === 'warming';
  if (filter === 'fresh') return ghostBand === 'fresh';
  return true;
}

export default function App() {
  const { applications, addApplication, updateApplication, deleteApplication } = useApplications();
  const { getGhostMeta } = useGhostDetection();

  const [filter, setFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [focusedApplicationId, setFocusedApplicationId] = useState(null);
  const [emailModal, setEmailModal] = useState({ application: null, loading: false, error: '', emailBody: '' });

  const ghostMetas = useMemo(
    () => Object.fromEntries(applications.map((app) => [app.id, getGhostMeta(app)])),
    [applications, getGhostMeta]
  );

  const filteredApps = useMemo(
    () => applications.filter((app) => matchesFilter(app, ghostMetas[app.id]?.ghostBand, filter)),
    [applications, filter, ghostMetas]
  );

  useEffect(() => {
    if (!filteredApps.length) {
      setFocusedApplicationId(null);
      return;
    }

    if (!filteredApps.some((app) => app.id === focusedApplicationId)) {
      setFocusedApplicationId(filteredApps[0].id);
    }
  }, [filteredApps, focusedApplicationId]);

  const focusedApplication = useMemo(
    () => applications.find((app) => app.id === focusedApplicationId) || filteredApps[0] || null,
    [applications, filteredApps, focusedApplicationId]
  );

  const stats = useMemo(() => {
    const values = Object.values(ghostMetas);
    return {
      total: applications.length,
      interviewing: applications.filter((a) => a.status === 'interviewing').length,
      fresh: values.filter((v) => v?.ghostBand === 'fresh').length,
      ghosted: values.filter((v) => v?.ghostBand === 'ghosted').length
    };
  }, [applications, ghostMetas]);

  const handleGenerateEmail = async () => {
    const application = emailModal.application;
    if (!application) return;

    setEmailModal((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const body = await generateFollowUpEmail(application, ghostMetas[application.id]);
      setEmailModal((prev) => ({ ...prev, emailBody: body, loading: false }));
    } catch (error) {
      setEmailModal((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  };

  return (
    <>
      <style>{baseStyles + shellStyles}</style>
      <main className="app-shell">
        <header className="brand">
          <div>
            <h1>Ghosted 👻</h1>
            <p>Track applications, spot ghosting early, and ship the right follow-up at the right time.</p>
          </div>
          <button type="button" className="primary-btn" onClick={() => setIsAddOpen(true)}>+ Add Application</button>
        </header>

        <Stats stats={stats} />

        <div style={{ marginTop: '1rem' }} className="dashboard-grid">
          <Dashboard
            applications={filteredApps}
            ghostMetas={ghostMetas}
            filter={filter}
            focusedApplicationId={focusedApplication?.id}
            onFilterChange={setFilter}
            onFocus={setFocusedApplicationId}
            onOpenEmail={(application) => setEmailModal({ application, loading: false, error: '', emailBody: '' })}
            onStatusChange={(id, status) => updateApplication(id, { status, lastActivityDate: new Date().toISOString().slice(0, 10) })}
            onDelete={deleteApplication}
          />

          <aside className="side-rail">
            <CompanyResearchCard application={focusedApplication} />
            <SmartTimingAdvisor application={focusedApplication} ghostMeta={focusedApplication ? ghostMetas[focusedApplication.id] : null} />
            <InterviewPrepGenerator application={focusedApplication} ghostMeta={focusedApplication ? ghostMetas[focusedApplication.id] : null} />
          </aside>
        </div>
      </main>

      {isAddOpen && <AddApplicationModal onClose={() => setIsAddOpen(false)} onAdd={addApplication} />}
      {emailModal.application && (
        <EmailModal
          application={emailModal.application}
          emailBody={emailModal.emailBody}
          loading={emailModal.loading}
          error={emailModal.error}
          onClose={() => setEmailModal({ application: null, loading: false, error: '', emailBody: '' })}
          onGenerate={handleGenerateEmail}
        />
      )}
    </>
  );
}
