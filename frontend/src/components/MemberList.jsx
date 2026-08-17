import React, { useState, useEffect } from 'react';
import api from '../api';

function MemberList() {
    const [members, setMembers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [memberFines, setMemberFines] = useState({});

    useEffect(() => {
        fetchMembers();
        const fetchFines = async () => {
            const res = await api.get('/transactions');
            const fines = res.data
                .filter(t => t.status === 'returned' && t.fine > 0)
                .reduce((acc, t) => {
                    acc[t.memberId] = (acc[t.memberId] || 0) + t.fine;
                    return acc;
                }, {});
            setMemberFines(fines);
        };
        fetchFines();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await api.get('/members');
            setMembers(res.data);
        } catch (err) {
            console.error('Error fetching members:', err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/members', form);
            setForm({ name: '', email: '', phone: '' });
            fetchMembers();
        } catch (err) {
            console.error('Error adding member:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this member?')) return;
        try {
            await api.delete(`/members/${id}`);
            fetchMembers();
        } catch (err) {
            console.error('Error deleting member:', err);
        }
    };

    // Seed button – now correctly calls fetchMembers()
    const handleSeed = async () => {
        if (!window.confirm('Replace all data with demo data?')) return;
        try {
            await api.post('/seed');
            fetchMembers(); // 
            alert('Demo data seeded!');
        } catch (err) {
            alert('Error seeding: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <h2>Members</h2>
                <button onClick={handleSeed} className="success" style={{ marginBottom: '10px' }}>
                    🌱 Seed Demo Data
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                <button type="submit">Add Member</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Joined</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.id}>
                            <td>{member.id}</td>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.phone}</td>
                            <td>{member.membershipDate}</td>
                            <td>
                                <button className="danger" onClick={() => handleDelete(member.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MemberList;