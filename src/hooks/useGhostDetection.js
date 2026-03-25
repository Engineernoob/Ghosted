import { useCallback } from 'react';

const getDaysSince = (dateString) => {
  const now = new Date();
  const target = new Date(dateString);
  return Math.max(0, Math.floor((now - target) / (1000 * 60 * 60 * 24)));
};

export const calculateGhostProbability = (application) => {
  const daysSinceLastActivity = getDaysSince(application.lastActivityDate || application.dateApplied);

  if (application.status === 'rejected') return 0;
  if (application.status === 'offer') return 0;
  if (application.status === 'ghosted') return 100;

  if (application.status === 'interviewing') {
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
  if (probability < 25) return 'fresh';
  if (probability < 50) return 'warming';
  if (probability < 80) return 'cold';
  return 'ghosted';
};

export function useGhostDetection() {
  const getGhostMeta = useCallback((application) => {
    const ghostProbability = calculateGhostProbability(application);
    const daysSinceLastActivity = getDaysSince(application.lastActivityDate || application.dateApplied);
    const daysSinceApplied = getDaysSince(application.dateApplied);

    return {
      ghostProbability,
      ghostBand: getGhostBand(ghostProbability),
      daysSinceLastActivity,
      daysSinceApplied
    };
  }, []);

  return { getGhostMeta };
}
