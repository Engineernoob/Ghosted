import { useState } from "react";

export default function ApplicationForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    company: "",
    companyDomain: "",
    role: "",
    appliedDate: "",
    lastContactDate: "",
    status: "applied",
    recruiterContact: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.company || !form.role) {
      alert("Company and role are required");
      return;
    }

    onAdd(form);

    setForm({
      company: "",
      companyDomain: "",
      role: "",
      appliedDate: "",
      lastContactDate: "",
      status: "applied",
      recruiterContact: "",
      notes: "",
    });

    if (onClose) onClose();
  };

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <h2>Add Application</h2>

      <label>
        Company
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Company Domain
        <input
          type="text"
          name="companyDomain"
          value={form.companyDomain}
          onChange={handleChange}
          placeholder="example.com"
        />
      </label>

      <label>
        Role
        <input
          type="text"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Applied Date
        <input
          type="date"
          name="appliedDate"
          value={form.appliedDate}
          onChange={handleChange}
        />
      </label>

      <label>
        Last Contact Date
        <input
          type="date"
          name="lastContactDate"
          value={form.lastContactDate}
          onChange={handleChange}
        />
      </label>

      <label>
        Status
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="ghosted">Ghosted</option>
        </select>
      </label>

      <label>
        Recruiter Contact
        <input
          type="text"
          name="recruiterContact"
          value={form.recruiterContact}
          onChange={handleChange}
        />
      </label>

      <label>
        Notes
        <textarea name="notes" value={form.notes} onChange={handleChange} />
      </label>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button type="submit" className="primary-btn">
          Add Application
        </button>

        {onClose && (
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
