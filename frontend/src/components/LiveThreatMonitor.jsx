import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Terminal, Clock, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function LiveThreatMonitor() {
    const [logs, setLogs] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    // Process logs for the chart (reverse to show oldest to newest left-to-right)
    const chartData = [...logs].reverse().map(log => ({
        time: new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        score: log.rule_score,
        decision: log.decision
    }));

    useEffect(() => {
        // 1. Fetch recent logs so the monitor isn't empty
        fetch('/history?limit=20')
            .then(res => res.json())
            .then(data => {
                setLogs(data);
            })
            .catch(err => console.error("Failed to fetch recent logs:", err));

        // 2. Connect to WebSocket
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/logs`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => setIsConnected(true);
        ws.onclose = () => setIsConnected(false);

        ws.onmessage = (event) => {
            try {
                const newLog = JSON.parse(event.data);
                if (!newLog.id) newLog.id = Date.now();
                setLogs(prev => [newLog, ...prev].slice(0, 50));
            } catch (e) {
                console.error("Error parsing log:", e);
            }
        };

        return () => ws.close();
    }, []);

    const getRiskLabel = (score) => {
        if (score >= 80) return 'MALICIOUS';
        if (score >= 40) return 'SUSPICIOUS';
        return 'SAFE';
    };

    return (
        <div className="container" style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Live Threat Monitor</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time stream of incoming prompt analysis.</p>
                </div>
                <div className={`status-badge ${isConnected ? 'status-allow' : 'status-block'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 8px currentColor' }} />
                    {isConnected ? 'LIVE FEED ACTIVE' : 'DISCONNECTED'}
                </div>
            </div>

            {/* Live Chart Section */}
            <div className="glass-panel" style={{ height: '250px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.03), transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Live Threat Severity</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.7 }}>Rolling 20 Events</span>
                </h3>

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorDanger" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
                        <XAxis dataKey="time" hide={true} />
                        <YAxis domain={[0, 100]} hide={true} />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(23, 23, 23, 0.9)',
                                border: '1px solid var(--border-highlight)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(8px)',
                                padding: '0.75rem'
                            }}
                            itemStyle={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 'bold' }}
                            labelStyle={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.8rem' }}
                            formatter={(value) => [value, "Risk Score"]}
                        />
                        <ReferenceLine y={80} stroke="var(--danger)" strokeDasharray="3 3" strokeOpacity={0.5} label={{ position: 'right', value: 'Critical', fill: 'var(--danger)', fontSize: 10 }} />

                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="url(#splitColorStroke)"
                            fill="url(#colorScore)"
                            strokeWidth={3}
                            animationDuration={500}
                        />
                        {/* Dynamic Stroke Color Logic via distinct layers or custom shape is complex in Recharts simple mode, 
                             so we will use a primary color that turns red if high. 
                             Actually, let's use a simple single gradient for now to ensure reliability, 
                             or map specific points. For a 'Simulated' look, a single high-tech green/blue line is often cleaner,
                             but let's try to color the line based on data if possible. 
                             Simplify: Just use Primary Green for now. It looks 'Matrix' style.
                        */}
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="var(--primary)"
                            fill="url(#colorScore)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--bg-app)', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="glass-panel" style={{ flex: 1, padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Dictionary Header */}
                <div style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(0,0,0,0.3)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    gap: '2rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'var(--font-mono)'
                }}>
                    <div style={{ width: '80px' }}>Timestamp</div>
                    <div style={{ width: '100px' }}>Decision</div>
                    <div style={{ width: '120px' }}>Risk Label</div>
                    <div style={{ flex: 1 }}>Payload Snippet</div>
                </div>

                {/* Scrollable log area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }} className="custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {logs.length === 0 ? (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', opacity: 0.5 }}>
                                <Activity size={48} style={{ marginBottom: '1rem' }} />
                                <p>Waiting for incoming traffic...</p>
                                <span className="loader" style={{ marginTop: '1rem' }}></span>
                            </div>
                        ) : (
                            logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20, height: 0 }}
                                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ marginBottom: '0.5rem' }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '2rem',
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: log.decision === 'BLOCK' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                                        borderLeft: `3px solid ${log.decision === 'BLOCK' ? 'var(--danger)' : 'var(--success)'}`,
                                        fontSize: '0.9rem',
                                        fontFamily: 'var(--font-mono)'
                                    }}>
                                        <div style={{ width: '80px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </div>

                                        <div style={{ width: '100px' }}>
                                            <span style={{
                                                padding: '0.15rem 0.5rem',
                                                borderRadius: '4px',
                                                background: log.decision === 'BLOCK' ? 'var(--danger)' : 'var(--success)',
                                                color: '#000',
                                                fontWeight: 'bold',
                                                fontSize: '0.75rem'
                                            }}>
                                                {log.decision}
                                            </span>
                                        </div>

                                        <div style={{ width: '120px' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                color: log.decision === 'BLOCK' ? 'var(--danger)' : 'var(--success)'
                                            }}>
                                                {getRiskLabel(log.rule_score)}
                                            </span>
                                        </div>

                                        <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>
                                            {log.prompt}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
