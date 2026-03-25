import { useCallback, useEffect, useState } from 'react';
import { makeId } from '../utils/id';

const STORAGE_KEY = 'ghosted.applications.v1';

const buildSeedData = () => [
  {
    id: makeId(),
    company: 'Vercel',
    companyDomain: 'vercel.com',
    role: 'Frontend Engineer Intern',
    dateApplied: new Date(Date.now() - 12 * 86400000).toISOString().slice(0, 10),
    lastActivityDate: new Date(Date.now() - 8 * 86400000).toISOString().slice(0, 10),
    status: 'applied',
    notes: 'Applied with referral from campus hackathon mentor.',
    recruiterContact: 'recruiting@vercel.com'
  },
  {
    id: makeId(),
    company: 'Stripe',
    companyDomain: 'stripe.com',
    role: 'Software Engineer New Grad',
    dateApplied: new Date(Date.now() - 20 * 86400000).toISOString().slice(0, 10),
    lastActivityDate: new Date(Date.now() - 15 * 86400000).toISOString().slice(0, 10),
    status: 'interviewing',
    notes: 'Completed recruiter screen. Waiting for onsite schedule.',
    recruiterContact: 'alex@stripe.com'
  }
];

export function useApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setApplications(parsed);
          return;
        }
      }
    } catch {
      // ignore malformed storage and fall back to seed data
    }

    setApplications(buildSeedData());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // storage quota/full privacy mode can block writes; keep app usable
    }
  }, [applications]);

  const addApplication = useCallback((application) => {
    setApplications((prev) => [
      {
        ...application,
        id: makeId()
      },
      ...prev
    ]);
  }, []);

  const updateApplication = useCallback((id, updates) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, ...updates } : app)));
  }, []);

  const deleteApplication = useCallback((id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  }, []);

  return {
    applications,
    addApplication,
    updateApplication,
    deleteApplication
  };
}
