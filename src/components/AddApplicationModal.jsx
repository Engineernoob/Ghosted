import { useState } from "react";

const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.75rem",
  borderRadius: "10px",
  border: "1px solid var(--border)",
  background: "#111827",
  color: "var(--text-primary)",
};

const initialForm = {
  company: "",
  companyDomain: "",
  role: "",
  dateApplied: new Date().toISOString().slice(0, 10),
  lastActivityDate: new Date().toISOString().slice(0, 10),
  status: "applied",
  notes: "",
  recruiterContact: "",
};

export default function AddApplicationModal({ onClose, onAdd }) {
  const [form, setForm] = useState(initialForm);

  const onSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-panel" onSubmit={onSubmit}>
        <h3>Add application</h3>
        <div className="form-grid">
          <input
            style={inputStyle}
            placeholder="Company"
            required
            value={form.company}
            onChange={(e) =>
              setForm((f) => ({ ...f, company: e.target.value }))
            }
          />
          <input
            style={inputStyle}
            placeholder="Company domain (optional)"
            value={form.companyDomain}
            onChange={(e) =>
              setForm((f) => ({ ...f, companyDomain: e.target.value }))
            }
          />
          <input
            style={inputStyle}
            placeholder="Role"
            required
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          />
          <select
            style={inputStyle}
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="ghosted">Ghosted</option>
          </select>
          <label>
            Date applied
            <input
              style={inputStyle}
              type="date"
              value={form.dateApplied}
              onChange={(e) =>
                setForm((f) => ({ ...f, dateApplied: e.target.value }))
              }
            />
          </label>
          <label>
            Last activity
            <input
              style={inputStyle}
              type="date"
              value={form.lastActivityDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastActivityDate: e.target.value }))
              }
            />
          </label>
          <input
            style={inputStyle}
            placeholder="Recruiter contact"
            value={form.recruiterContact}
            onChange={(e) =>
              setForm((f) => ({ ...f, recruiterContact: e.target.value }))
            }
          />
          <textarea
            style={inputStyle}
            rows={4}
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
