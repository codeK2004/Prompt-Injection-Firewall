import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Search, FileDown, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HistoryLog() {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('ALL'); // ALL, ALLOW, BLOCK
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch('http://localhost:8000/history');
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        }
    };

    const downloadCSV = () => {
        if (logs.length === 0) return;

        const headers = ['Timestamp', 'Decision', 'Rule Score', 'Risk Label', 'Prompt'];
        const csvContent = [
            headers.join(','),
            ...logs.map(log => {
                const riskLabel = log.rule_score >= 80 ? 'MALICIOUS' : log.rule_score >= 40 ? 'SUSPICIOUS' : 'SAFE';
                const cleanPrompt = log.prompt.replace(/"/g, '""'); // Escape quotes
                return `"${log.timestamp}","${log.decision}","${log.rule_score}","${riskLabel}","${cleanPrompt}"`;
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `security_audit_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearHistory = async () => {
        if (!confirm("Are you sure you want to clear all history? This cannot be undone.")) return;

        try {
            await fetch('http://localhost:8000/history', { method: 'DELETE' });
            setLogs([]);
        } catch (err) {
            console.error("Failed to clear history:", err);
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesFilter = filter === 'ALL' || log.decision === filter;
        const matchesSearch = log.prompt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="container" style={{ paddingTop: '2rem', height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Audit History</h1>

                <div style={{ display: 'flex', gap: '1rem' }}>

                    <button
                        onClick={clearHistory}
                        className="btn btn-danger"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Trash2 size={16} />
                        Clear History
                    </button>

                    <button
                        onClick={downloadCSV}
                        className="btn btn-cyber-blue"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <FileDown size={16} />
                        Export CSV
                    </button>

                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search payloads..."
                            className="input-base"
                            style={{ paddingLeft: '2.5rem', width: '250px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', background: 'var(--bg-panel)', borderRadius: 'var(--radius-sm)', padding: '0.25rem', border: '1px solid var(--border)' }}>
                        {['ALL', 'ALLOW', 'BLOCK'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    background: filter === f ? 'var(--bg-app)' : 'transparent',
                                    color: filter === f ? 'var(--text-main)' : 'var(--text-muted)',
                                    border: filter === f ? '1px solid var(--border-highlight)' : 'none',
                                    borderRadius: '4px',
                                    padding: '0.25rem 0.75rem',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 100px 1fr 100px',
                    padding: '1rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderBottom: '1px solid var(--border)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                }}>
                    <div>Time</div>
                    <div>Status</div>
                    <div>Payload</div>
                    <div style={{ textAlign: 'center' }}>Rule Score</div>
                </div>

                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredLogs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '80px 100px 1fr 100px',
                                padding: '1rem',
                                borderBottom: '1px solid var(--border)',
                                alignItems: 'center',
                                fontSize: '0.9rem'
                            }}
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                        >
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '99px',
                                    fontSize: '0.75rem',
                                    background: log.decision === 'BLOCK' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    color: log.decision === 'BLOCK' ? 'var(--danger)' : 'var(--success)',
                                    border: `1px solid ${log.decision === 'BLOCK' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                }}>
                                    {log.decision === 'BLOCK' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                                    {log.decision}
                                </span>
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                paddingRight: '1rem',
                                color: 'var(--text-main)'
                            }}>
                                {log.prompt}
                            </div>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                {log.rule_score}
                            </div>
                        </motion.div>
                    ))}
                    {filteredLogs.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No logs found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
