import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Terminal, Clock, Activity } from 'lucide-react';

export default function LiveThreatMonitor() {
    const [logs, setLogs] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        // 1. Fetch recent logs so the monitor isn't empty
        fetch('/history?limit=20') // Use the history endpoint
            .then(res => res.json())
            .then(data => {
                // Determine scrolling: if we are at bottom, keep at bottom? 
                // For now just set the logs.
                setLogs(data);
            })
            .catch(err => console.error("Failed to fetch recent logs:", err));

        // 2. Connect to WebSocket for real-time updates
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

            <div className="glass-panel" style={{ flex: 1, padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Terminal Header */}
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
                    <div style={{ width: '120px' }}>Risk Score (AI)</div>
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

                                        <div style={{ width: '120px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{
                                                width: '100%',
                                                height: '4px',
                                                background: 'var(--border)',
                                                borderRadius: '2px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${log.ai_score}%`,
                                                    height: '100%',
                                                    background: log.ai_score > 70 ? 'var(--danger)' : log.ai_score > 40 ? 'var(--warning)' : 'var(--success)'
                                                }} />
                                            </div>
                                            <span style={{ fontSize: '0.8rem' }}>{log.ai_score}</span>
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
