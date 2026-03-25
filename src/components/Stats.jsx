import React from "react";

const cardStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  padding: "1rem",
  minWidth: 0,
};

export default function Stats({ stats }) {
  const items = [
    { label: "Total Apps", value: stats.total },
    { label: "Interviewing", value: stats.interviewing },
    { label: "Fresh", value: stats.fresh },
    { label: "Ghosted", value: stats.ghosted },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
        gap: "0.8rem",
      }}
    >
      {items.map((item) => (
        <div key={item.label} style={cardStyle}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            {item.label}
          </div>
          <div style={{ marginTop: 8, fontWeight: 700, fontSize: "1.6rem" }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
