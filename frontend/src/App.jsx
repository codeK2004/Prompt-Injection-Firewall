import { useState } from "react";
import Layout from "./components/Layout";
import PromptForm from "./components/PromptForm";
import ResultCard from "./components/ResultCard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import LiveThreatMonitor from "./components/LiveThreatMonitor";
import HistoryLog from "./components/HistoryLog";
import Settings from "./components/Settings";
import { ShieldAlert, Activity } from "lucide-react";

function App() {
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dashboard View Component
  const DashboardView = () => (
    <div className="container">
      <header className="header" style={{ border: 'none', textAlign: 'left', padding: '2rem 0 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Security <span style={{ color: 'var(--primary)' }}>Dashboard</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: '1.1rem' }}>
          Real-time LLM Threat Detection & Analytics System
        </p>
      </header>

      <div className="grid-layout">
        <section className="input-section">
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <ShieldAlert size={20} color="var(--primary)" />
              Prompt Analysis
            </h2>
            <PromptForm setResult={setResult} />
            <div style={{ marginTop: "2rem" }}>
              <ResultCard result={result} />
            </div>
          </div>
        </section>

        <section className="analytics-section">
          <div className="glass-panel" style={{ padding: '2rem', height: '100%' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Activity size={20} color="var(--success)" />
              Live Metrics
            </h2>
            <AnalyticsDashboard />
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'monitor' && <LiveThreatMonitor />}
      {activeTab === 'history' && <HistoryLog />}
      {activeTab === 'settings' && <Settings />}
    </Layout>
  );
}

export default App;
