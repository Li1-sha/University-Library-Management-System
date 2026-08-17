import React, { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalMembers: 0,
        borrowedCount: 0,
        overdueCount: 0,
    });
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleSeed = async () => {
        if (!window.confirm('This will replace all data with demo data. Continue?')) return;
        setSeeding(true);
        try {
            await api.post('/seed');
            window.dispatchEvent(new Event('seedComplete'));
            fetchStats(); // refresh stats
            // also refresh other pages if needed, but they'll reload on next visit
        } catch (err) {
            alert('Error seeding data: ' + (err.response?.data?.error || err.message));
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <h2>Dashboard</h2>
                <button onClick={handleSeed} disabled={seeding} style={{ background: '#10b981' }}>
                    {seeding ? 'Seeding...' : '🌱 Seed Demo Data'}
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>📖 Books</h3>
                    <div className="number">{stats.totalBooks}</div>
                </div>
                <div className="stat-card">
                    <h3>👤 Members</h3>
                    <div className="number">{stats.totalMembers}</div>
                </div>
                <div className="stat-card">
                    <h3>📤 Borrowed</h3>
                    <div className="number">{stats.borrowedCount}</div>
                </div>
                <div className={`stat-card ${stats.overdueCount > 0 ? 'overdue' : ''}`}>
                    <h3>⏰ Overdue</h3>
                    <div className="number">{stats.overdueCount}</div>
                </div>
                <div className="stat-card">
                    <h3>💰 Unpaid Fines</h3>
                    <div className="number">${stats.totalFines || 0} OMR</div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;