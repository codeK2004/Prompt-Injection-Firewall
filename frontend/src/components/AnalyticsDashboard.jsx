import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Shield, AlertTriangle, Zap } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [data, setData] = useState({
    total_prompts: 0,
    allowed: 0,
    blocked: 0,
    average_rule_score: 0,
    average_ai_score: 0,
    daily_trend: []
  });

  useEffect(() => {
    // 1. Fetch initial data via REST API
    fetch('/analytics') // Proxy handles this now
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Failed to fetch initial analytics:", err));

    // 2. Subscribe to real-time updates via WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/analytics`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("Connected to Analytics WS");
    ws.onmessage = (event) => {
      try {
        const analytics = JSON.parse(event.data);
        setData(analytics);
      } catch (e) {
        console.error("Failed to parse analytics data", e);
      }
    };

    return () => ws.close();
  }, []);

  const pieData = [
    { name: "Allowed", value: data.allowed || 0 },
    { name: "Blocked", value: data.blocked || 0 }
  ];

  const COLORS = ["var(--success)", "var(--danger)"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", height: '100%' }}>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>

        <div className="glass-panel" style={{ padding: "1.5rem", display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} color="var(--primary)" /> Total Scans
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-main)" }}>
            {data.total_prompts}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} color="var(--warning)" /> Avg Rule Score
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--warning)" }}>
            {data.average_rule_score}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} color="var(--danger)" /> Avg AI Risk
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--danger)" }}>
            {data.average_ai_score}
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', flex: 1 }}>
        <div style={{ height: "250px", width: '100%' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Traffic Distribution</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "var(--bg-panel)", borderColor: "var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-main)" }}
                itemStyle={{ color: "var(--text-main)" }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
