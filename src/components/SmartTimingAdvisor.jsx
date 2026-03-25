import React from "react";

const urgencyColor = {
  low: "var(--fresh)",
  medium: "var(--warming)",
  high: "var(--cold)",
  critical: "var(--ghosted)",
};

const cardStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  padding: "1rem",
};

function getNextBusinessSlot(urgency) {
  const now = new Date();
  const target = new Date(now);

  if (urgency === "critical") {
    target.setHours(now.getHours() + 2);
  } else if (urgency === "high") {
    target.setDate(now.getDate() + 1);
    target.setHours(10, 0, 0, 0);
  } else if (urgency === "medium") {
    target.setDate(now.getDate() + 2);
    target.setHours(11, 0, 0, 0);
  } else {
    target.setDate(now.getDate() + 4);
    target.setHours(9, 30, 0, 0);
  }

  while (target.getDay() === 0 || target.getDay() === 6) {
    target.setDate(target.getDate() + 1);
    target.setHours(10, 0, 0, 0);
  }

  return target;
}

export function getTimingAdvice(application, ghostMeta) {
  if (!application || !ghostMeta) return null;

  const probability = ghostMeta.ghostProbability;
  const isInterviewing = application.status === "interviewing";

  let urgency = "low";
  if (probability >= 80) urgency = "critical";
  else if (probability >= 55 || isInterviewing) urgency = "high";
  else if (probability >= 25) urgency = "medium";

  const sendAt = getNextBusinessSlot(urgency);
  const strategy =
    urgency === "critical"
      ? "Send a graceful final follow-up now and close with a clear yes/no CTA."
      : urgency === "high"
        ? "Follow up next business morning while momentum from interviews is still warm."
        : urgency === "medium"
          ? "Wait for a mid-week window and send a concise nudge with one new value point."
          : "No urgency yet — hold, then send a friendly check-in if silence continues.";

  return {
    urgency,
    strategy,
    sendAt,
    reason: `${ghostMeta.daysSinceLastActivity} days since last activity at ${probability}% ghost risk.`,
  };
}

export default function SmartTimingAdvisor({ application, ghostMeta }) {
  const advice = getTimingAdvice(application, ghostMeta);
  if (!advice) return null;

  return (
    <aside style={cardStyle}>
      <h3 style={{ marginTop: 0, marginBottom: 6 }}>Smart Timing Advisor</h3>
      <p style={{ marginTop: 0, color: "var(--text-secondary)" }}>
        {advice.reason}
      </p>
      <p>
        Recommended send time:{" "}
        <strong>
          {advice.sendAt.toLocaleString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </strong>
      </p>
      <p style={{ marginBottom: 0 }}>
        Urgency:{" "}
        <strong
          style={{
            color: urgencyColor[advice.urgency],
            textTransform: "capitalize",
          }}
        >
          {advice.urgency}
        </strong>
      </p>
      <p style={{ marginBottom: 0, color: "var(--text-secondary)" }}>
        {advice.strategy}
      </p>
    </aside>
  );
}
