import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/analytics");

    ws.onmessage = (event) => {
      const analytics = JSON.parse(event.data);
      setData(analytics);
    };

    return () => ws.close();
  }, []);

  if (!data) return (
    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
      <p style={{ color: "var(--text-secondary)" }}>Connecting to live analytics...</p>
    </div>
  );

  const pieData = [
    { name: "Allowed", value: data.allowed },
    { name: "Blocked", value: data.blocked }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Total Scans</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{data.total_prompts}</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Avg Rule Score</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}>{data.average_rule_score}</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Avg AI Risk</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ec4899" }}>{data.average_ai_score}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-layout">
        <div className="card">
          <h3 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Traffic Decision Distribution</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="var(--bg-card)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", borderRadius: "0.5rem" }}
                  itemStyle={{ color: "var(--text-primary)" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Daily Scan Volume</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.daily_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", borderRadius: "0.5rem" }}
                  itemStyle={{ color: "var(--text-primary)" }}
                />
                <Bar dataKey="count" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
