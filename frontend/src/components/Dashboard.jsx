import React, { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    borrowedCount: 0,
    overdueCount: 0,
  });

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

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '150px' }}>
          <h3>📖 Books</h3>
          <p style={{ fontSize: '24px' }}>{stats.totalBooks}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '150px' }}>
          <h3>👤 Members</h3>
          <p style={{ fontSize: '24px' }}>{stats.totalMembers}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '150px' }}>
          <h3>📤 Borrowed</h3>
          <p style={{ fontSize: '24px' }}>{stats.borrowedCount}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '150px', backgroundColor: stats.overdueCount > 0 ? '#ffe6e6' : 'white' }}>
          <h3>⏰ Overdue</h3>
          <p style={{ fontSize: '24px', color: stats.overdueCount > 0 ? 'red' : 'black' }}>{stats.overdueCount}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;