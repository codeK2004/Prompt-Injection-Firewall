import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, setActiveTab }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div style={{
                flex: 1,
                marginLeft: '260px',
                maxWidth: 'calc(100% - 260px)',
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <main style={{ flex: 1, padding: '2rem' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
