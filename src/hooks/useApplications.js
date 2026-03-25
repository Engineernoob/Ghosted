import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ghosted.applications.v1";

const seedData = [
  {
    id: crypto.randomUUID(),
    company: "Vercel",
    companyDomain: "vercel.com",
    role: "Frontend Engineer Intern",
    appliedDate: new Date(Date.now() - 12 * 86400000)
      .toISOString()
      .slice(0, 10),
    lastContactDate: new Date(Date.now() - 8 * 86400000)
      .toISOString()
      .slice(0, 10),
    status: "applied",
    notes: "Applied with referral from campus hackathon mentor.",
    recruiterContact: "recruiting@vercel.com",
  },
  {
    id: crypto.randomUUID(),
    company: "Stripe",
    companyDomain: "stripe.com",
    role: "Software Engineer New Grad",
    appliedDate: new Date(Date.now() - 20 * 86400000)
      .toISOString()
      .slice(0, 10),
    lastContactDate: new Date(Date.now() - 15 * 86400000)
      .toISOString()
      .slice(0, 10),
    status: "interviewing",
    notes: "Completed recruiter screen. Waiting for onsite schedule.",
    recruiterContact: "alex@stripe.com",
  },
];

const normalizeApplication = (application) => {
  const appliedDate = application.appliedDate || application.dateApplied || "";
  const lastContactDate =
    application.lastContactDate || application.lastActivityDate || appliedDate;

  return {
    ...application,
    appliedDate,
    dateApplied: appliedDate,
    lastContactDate,
    lastActivityDate: lastContactDate,
  };
};

const buildSeedData = () => seedData.map(normalizeApplication);

export function useApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setApplications(parsed.map(normalizeApplication));
          return;
        }
      }
    } catch {
      // ignore malformed storage and fall back to seed data
    }

    setApplications(buildSeedData());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  const addApplication = useCallback((application) => {
    setApplications((prev) => [
      normalizeApplication({
        ...application,
        id: crypto.randomUUID(),
      }),
      ...prev,
    ]);
  }, []);

  const updateApplication = useCallback((id, updates) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? normalizeApplication({ ...app, ...updates }) : app,
      ),
    );
  }, []);

  const deleteApplication = useCallback((id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  }, []);

  return {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
  };
}
