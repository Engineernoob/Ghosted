import { useMemo, useState } from "react";

export default function EmailModal({
  application,
  emailBody,
  loading,
  error,
  onClose,
  onGenerate,
}) {
  const [copied, setCopied] = useState(false);

  const company = application?.company || "this company";
  const role = application?.role || "this role";

  const previewText = useMemo(() => {
    if (loading) return "Generating your follow-up...";
    if (emailBody) return emailBody;
    return "No follow-up generated yet. Click the button below to draft one.";
  }, [emailBody, loading]);

  const handleCopy = async () => {
    if (!emailBody) return;

    try {
      await navigator.clipboard.writeText(emailBody);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 14,
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>AI Follow-up for {company}</h3>
            <p
              style={{
                color: "var(--text-secondary)",
                margin: "0.35rem 0 0",
                lineHeight: 1.5,
              }}
            >
              Role: {role}
            </p>
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
            aria-label="Close follow-up modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <p style={{ color: "var(--ghosted)", marginTop: 0 }}>{error}</p>
        )}

        <textarea
          readOnly
          value={previewText}
          rows={12}
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.04)",
            color: "var(--text-primary)",
            padding: "0.9rem 1rem",
            resize: "vertical",
            boxSizing: "border-box",
            opacity: !emailBody && !loading ? 0.8 : 1,
          }}
        />

        <div
          className="modal-actions"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 14,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" className="secondary-btn" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={handleCopy}
              disabled={!emailBody}
              style={{ opacity: emailBody ? 1 : 0.6 }}
            >
              {copied ? "Copied" : "Copy Email"}
            </button>
          </div>

          <button
            type="button"
            className="primary-btn"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : emailBody ? "Regenerate" : "Generate Follow-up"}
          </button>
        </div>
      </div>
    </div>
  );
}
