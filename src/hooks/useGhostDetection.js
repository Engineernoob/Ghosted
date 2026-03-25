import { useCallback } from "react";

const getDaysSince = (dateString) => {
  if (!dateString) return 0;

  const now = new Date();
  const target = new Date(dateString);

  if (Number.isNaN(target.getTime())) return 0;

  return Math.max(0, Math.floor((now - target) / (1000 * 60 * 60 * 24)));
};

const getAppliedDate = (application) =>
  application.appliedDate || application.dateApplied || null;

const getLastActivityDate = (application) =>
  application.lastContactDate ||
  application.lastActivityDate ||
  getAppliedDate(application);

export const calculateGhostProbability = (application) => {
  const daysSinceLastActivity = getDaysSince(getLastActivityDate(application));

  const status = String(application.status || "").toLowerCase();

  if (status === "rejected") return 0;
  if (status === "offer") return 0;
  if (status === "ghosted") return 100;

  if (status === "interviewing" || status === "interview") {
    if (daysSinceLastActivity <= 3) return 10;
    if (daysSinceLastActivity <= 7) return 35;
    if (daysSinceLastActivity <= 10) return 60;
    if (daysSinceLastActivity <= 14) return 80;
    return 95;
  }

  if (daysSinceLastActivity <= 3) return 5;
  if (daysSinceLastActivity <= 7) return 25;
  if (daysSinceLastActivity <= 14) return 55;
  if (daysSinceLastActivity <= 21) return 75;
  return 90;
};

const getGhostBand = (probability) => {
  if (probability < 25) return "fresh";
  if (probability < 50) return "warming";
  if (probability < 80) return "cold";
  return "ghosted";
};

export function useGhostDetection() {
  const getGhostMeta = useCallback((application) => {
    const ghostProbability = calculateGhostProbability(application);
    const daysSinceLastActivity = getDaysSince(getLastActivityDate(application));
    const daysSinceApplied = getDaysSince(getAppliedDate(application));

    return {
      ghostProbability,
      ghostBand: getGhostBand(ghostProbability),
      daysSinceLastActivity,
      daysSinceApplied,
    };
  }, []);

  return { getGhostMeta };
}
