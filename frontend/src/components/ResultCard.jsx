import ReactMarkdown from 'react-markdown';

export default function ResultCard({ result }) {
  if (!result) return null;

  const isBlocked = result.decision === "BLOCK";
  const statusColor = isBlocked ? "var(--accent-danger)" : "var(--accent-success)";
  const borderColor = isBlocked ? "rgba(239, 68, 68, 0.5)" : "rgba(34, 197, 94, 0.5)";
  const bgColor = isBlocked ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)";

  return (
    <div className="card" style={{
      border: `1px solid ${borderColor}`,
      background: `linear-gradient(to bottom, ${bgColor}, var(--bg-card))`
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0 }}>Analysis Result</h3>
        <span style={{
          backgroundColor: bgColor,
          color: statusColor,
          padding: "0.25rem 0.75rem",
          borderRadius: "9999px",
          fontWeight: "bold",
          border: `1px solid ${statusColor}`
        }}>
          {result.decision}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ background: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "0.5rem" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Rule Score</span>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{result.rule_score}</div>
        </div>
        <div style={{ background: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "0.5rem" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>AI Risk Score</span>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{result.ai_score}</div>
        </div>
      </div>

      <div>
        <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>System Response:</span>
        <div style={{
          background: "rgba(0,0,0,0.3)",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginTop: "0.25rem",
          borderLeft: `4px solid ${statusColor}`,
          lineHeight: "1.6"
        }}>
          <ReactMarkdown>{result.response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}