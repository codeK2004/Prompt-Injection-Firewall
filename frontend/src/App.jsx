import { useState } from "react";
import PromptForm from "./components/PromptForm";
import ResultCard from "./components/ResultCard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="container">
      <header className="header">
        <h1>🛡️ Prompt Injection Firewall</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Real-time LLM Security & Analytics
        </p>
      </header>

      <main className="grid-layout">
        <section className="input-section">
          <PromptForm setResult={setResult} />
          <div style={{ marginTop: "2rem" }}>
            <ResultCard result={result} />
          </div>
        </section>

        <section className="analytics-section">
          <AnalyticsDashboard />
        </section>
      </main>
    </div>
  );
}

export default App;
