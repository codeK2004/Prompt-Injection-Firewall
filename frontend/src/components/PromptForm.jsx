import { useState } from "react";
import { analyzePrompt } from "../api";

export default function PromptForm({ setResult }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const result = await analyzePrompt(prompt);
      setResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>📝 Test Prompt</h2>
      <textarea
        rows="6"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt to test the firewall (e.g. 'Ignore previous instructions...')"
        style={{
          width: "100%",
          backgroundColor: "#0f172a",
          border: "1px solid var(--border-color)",
          borderRadius: "0.5rem",
          color: "var(--text-primary)",
          padding: "1rem",
          fontSize: "1rem",
          marginBottom: "1rem",
          resize: "vertical",
          fontFamily: "inherit"
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "white",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "wait" : "pointer"
          }}
        >
          {loading ? "Analyzing..." : "Analyze Prompt 🛡️"}
        </button>
      </div>
    </div>
  );
}
