const statusColors = {
  applied: "#6b7280",
  interviewing: "#8b5cf6",
  offer: "#10b981",
  rejected: "#ef4444",
  ghosted: "#ef4444",
};

const probabilityColors = {
  fresh: "var(--fresh)",
  warming: "var(--warming)",
  cold: "var(--cold)",
  ghosted: "var(--ghosted)",
};

export default function ApplicationCard({
  application,
  ghostMeta,
  onOpenEmail,
  onStatusChange,
  onDelete,
}) {
  const logoUrl = application.companyDomain
    ? `https://logo.clearbit.com/${application.companyDomain}`
    : null;

  return (
    <article className="app-card">
      <header style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${application.company} logo`}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#fff",
            }}
          />
        ) : (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "var(--accent-gradient)",
              display: "grid",
              placeItems: "center",
            }}
          >
            👻
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{application.company}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {application.role}
          </div>
        </div>
        <span
          className="status-badge"
          style={{
            background: `${statusColors[application.status]}22`,
            color: statusColors[application.status],
          }}
        >
          {application.status}
        </span>
      </header>

      <div style={{ marginTop: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          <span>Ghost-o-meter</span>
          <span>{ghostMeta.ghostProbability}%</span>
        </div>
        <div className="meter-track">
          <div
            className="meter-fill"
            style={{
              width: `${ghostMeta.ghostProbability}%`,
              background: probabilityColors[ghostMeta.ghostBand],
            }}
          />
          <div
            className="meter-fill"
            style={{
              width: `${ghostMeta.ghostProbability}%`,
              background: probabilityColors[ghostMeta.ghostBand],
            }}
          />
        </div>
      </div>

      <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
        Last activity:{" "}
        <strong style={{ color: "var(--text-primary)" }}>
          {ghostMeta.daysSinceLastActivity} days ago
        </strong>
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {ghostMeta.ghostProbability > 25 && (
          <button type="button" className="primary-btn" onClick={onOpenEmail}>
            Generate Follow-up
          </button>
        )}
        <select
          className="secondary-btn"
          style={{ border: "1px solid var(--border)" }}
          value={application.status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="ghosted">Ghosted</option>
        </select>
        <button type="button" className="secondary-btn" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}
