import React from 'react';
import { Shield, Activity, Clock, Settings, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'monitor', label: 'Live Monitor', icon: Activity },
        { id: 'history', label: 'History', icon: Clock },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside style={{
            width: '260px',
            backgroundColor: 'var(--bg-panel)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 50
        }}>
            <div style={{
                padding: '2rem 1.5rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <div style={{
                    background: 'rgba(6, 182, 212, 0.1)',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--primary)'
                }}>
                    <Shield size={24} />
                </div>
                <h2 style={{
                    fontSize: '1.25rem',
                    margin: 0,
                    letterSpacing: '0.05em',
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                }}>
                    SECURE<span style={{ color: 'var(--primary)' }}>.AI</span>
                </h2>
            </div>

            <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        backgroundColor: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                                        border: '1px solid',
                                        borderColor: isActive ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                                        borderRadius: 'var(--radius-sm)',
                                        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        textAlign: 'left',
                                        fontSize: '0.95rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                                            e.currentTarget.style.color = 'var(--text-main)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = 'var(--text-muted)';
                                        }
                                    }}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--success)',
                        boxShadow: '0 0 8px var(--success)'
                    }} />
                    System Online
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
