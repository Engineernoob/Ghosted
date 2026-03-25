import { useMemo, useState } from "react";

const initialForm = {
  company: "",
  companyDomain: "",
  role: "",
  appliedDate: new Date().toISOString().slice(0, 10),
  lastContactDate: "",
  status: "applied",
  recruiterContact: "",
  notes: "",
};

const fieldStyles = {
  display: "grid",
  gap: 6,
  fontSize: 14,
  color: "var(--text-secondary)",
};

const inputStyles = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.04)",
  color: "var(--text-primary)",
  padding: "0.8rem 0.95rem",
  outline: "none",
  boxSizing: "border-box",
};

export default function ApplicationForm({ onAdd, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () => form.company.trim() && form.role.trim(),
    [form.company, form.role],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.company.trim() || !form.role.trim()) {
      setError("Company and role are required.");
      return;
    }

    onAdd({
      ...form,
      company: form.company.trim(),
      companyDomain: form.companyDomain.trim(),
      role: form.role.trim(),
      recruiterContact: form.recruiterContact.trim(),
      notes: form.notes.trim(),
      lastContactDate: form.lastContactDate || form.appliedDate,
    });

    setForm(initialForm);

    if (onClose) onClose();
  };

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "var(--text-primary)" }}>
            Add application
          </h2>
          <p
            style={{
              margin: "0.45rem 0 0",
              color: "var(--text-secondary)",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Add a new role to Ghosted so it can track silence, timing, and your
            next follow-up.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close add application form"
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-secondary)",
              borderRadius: 10,
              padding: "0.55rem 0.8rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 14,
        }}
      >
        <label style={fieldStyles}>
          Company
          <input
            style={inputStyles}
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="OpenAI"
            required
          />
        </label>

        <label style={fieldStyles}>
          Role
          <input
            style={inputStyles}
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Software Engineer Intern"
            required
          />
        </label>

        <label style={fieldStyles}>
          Company domain
          <input
            style={inputStyles}
            type="text"
            name="companyDomain"
            value={form.companyDomain}
            onChange={handleChange}
            placeholder="openai.com"
          />
        </label>

        <label style={fieldStyles}>
          Recruiter contact
          <input
            style={inputStyles}
            type="text"
            name="recruiterContact"
            value={form.recruiterContact}
            onChange={handleChange}
            placeholder="recruiter@company.com"
          />
        </label>

        <label style={fieldStyles}>
          Applied date
          <input
            style={inputStyles}
            type="date"
            name="appliedDate"
            value={form.appliedDate}
            onChange={handleChange}
          />
        </label>

        <label style={fieldStyles}>
          Last contact date
          <input
            style={inputStyles}
            type="date"
            name="lastContactDate"
            value={form.lastContactDate}
            onChange={handleChange}
          />
        </label>

        <label style={fieldStyles}>
          Status
          <select
            style={inputStyles}
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="ghosted">Ghosted</option>
          </select>
        </label>

        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "0.8rem 0.95rem",
            background: "rgba(255,255,255,0.03)",
            alignSelf: "end",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
            }}
          >
            Quick tip
          </p>
          <p
            style={{
              margin: "0.45rem 0 0",
              fontSize: 14,
              lineHeight: 1.5,
              color: "var(--text-primary)",
            }}
          >
            Leave “last contact date” blank on fresh applications and Ghosted
            will use the applied date automatically.
          </p>
        </div>

        <label style={{ ...fieldStyles, gridColumn: "1 / -1" }}>
          Notes
          <textarea
            style={{ ...inputStyles, minHeight: 110, resize: "vertical" }}
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Applied through Handshake, reached out to recruiter, waiting on interview loop..."
          />
        </label>
      </div>

      {error && (
        <p
          style={{
            margin: "0.9rem 0 0",
            color: "#fca5a5",
            fontSize: 14,
          }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          marginTop: 18,
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-secondary)",
              borderRadius: 12,
              padding: "0.8rem 1rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="primary-btn"
          disabled={!canSubmit}
          style={{ opacity: canSubmit ? 1 : 0.6, cursor: canSubmit ? "pointer" : "not-allowed" }}
        >
          Add Application
        </button>
      </div>
    </form>
  );
}
