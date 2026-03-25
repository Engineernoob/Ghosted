import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ghosted.applications.v1';

const seedData = [
  {
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
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
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setApplications(JSON.parse(saved));
    } else {
      setApplications(seedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  const addApplication = useCallback((application) => {
    setApplications((prev) => [
      {
        ...application,
        id: crypto.randomUUID()
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
