import { useState } from 'react';
import { Save, Bell, Shield, Sliders } from 'lucide-react';

export default function Settings() {
    const [sensitivity, setSensitivity] = useState(75);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [autoBlock, setAutoBlock] = useState(true);

    return (
        <div className="container" style={{ paddingTop: '2rem', height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>System Settings</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Configure firewall rules and alert preferences.</p>
                </div>
                <button className="btn btn-primary">
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            <div className="grid-layout">

                {/* Security Level Card */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>Firewall Sensitivity</h3>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Adjust the strictness of the AI analysis engine.</p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label>Risk Threshold</label>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{sensitivity}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sensitivity}
                            onChange={(e) => setSensitivity(e.target.value)}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Prompts with an AI Risk Score above {sensitivity} will be automatically blocked.
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontWeight: '500' }}>Auto-Block Threats</span>
                        <label className="switch">
                            <input type="checkbox" checked={autoBlock} onChange={() => setAutoBlock(!autoBlock)} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>

                {/* Notifications Card */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', color: 'var(--warning)' }}>
                            <Bell size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>Notifications</h3>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Manage how you receive security alerts.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)' }}>
                            <div>
                                <div style={{ fontWeight: '500' }}>Email Alerts</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive reports for high-risk blocks</div>
                            </div>
                            <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} style={{ accentColor: 'var(--primary)', width: '1.2rem', height: '1.2rem' }} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)' }}>
                            <div>
                                <div style={{ fontWeight: '500' }}>Slack Integration</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Send alerts to #security-ops</div>
                            </div>
                            <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>Configure</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
