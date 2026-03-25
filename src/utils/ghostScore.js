export function getGhostScore(application) {
  const today = new Date();

  const lastContact = application.lastContactDate
    ? new Date(application.lastContactDate)
    : new Date(application.appliedDate);

  const diffTime = today - lastContact;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (application.status === "Rejected" || application.status === "Offer") {
    return {
      risk: "None",
      color: "gray",
      reason: "Application resolved",
      daysSinceContact: diffDays,
    };
  }

  if (application.status === "Interview" && diffDays >= 7) {
    return {
      risk: "High",
      color: "red",
      reason: `No response ${diffDays} days after interview`,
      daysSinceContact: diffDays,
    };
  }

  if (diffDays <= 6) {
    return {
      risk: "Low",
      color: "green",
      reason: `Last contact ${diffDays} day(s) ago`,
      daysSinceContact: diffDays,
    };
  }

  if (diffDays <= 13) {
    return {
      risk: "Follow Up Soon",
      color: "yellow",
      reason: `No response for ${diffDays} days`,
      daysSinceContact: diffDays,
    };
  }

  if (diffDays <= 20) {
    return {
      risk: "Medium",
      color: "orange",
      reason: `No response for ${diffDays} days`,
      daysSinceContact: diffDays,
    };
  }

  return {
    risk: "High",
    color: "red",
    reason: `Likely ghosted: ${diffDays} days`,
    daysSinceContact: diffDays,
  };
}
