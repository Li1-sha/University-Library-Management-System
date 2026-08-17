import React, { useState, useEffect } from 'react';
import api from '../api';

function MemberList() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchMembers();
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

  return (
    <div>
      <h2>Members</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <button type="submit">Add Member</button>
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                <button onClick={() => handleDelete(member.id)} style={{ background: 'red', color: 'white', border: 'none' }}>
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