import React, { useState, useEffect } from 'react';
import api from '../api';

function TransactionManager() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [borrowForm, setBorrowForm] = useState({ bookId: '', memberId: '' });
  const [returnForm, setReturnForm] = useState({ transactionId: '' });

  useEffect(() => {
    fetchBooks();
    fetchMembers();
    fetchTransactions();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBorrowChange = (e) => {
    setBorrowForm({ ...borrowForm, [e.target.name]: e.target.value });
  };
  const handleReturnChange = (e) => {
    setReturnForm({ transactionId: e.target.value });
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions/borrow', borrowForm);
      setBorrowForm({ bookId: '', memberId: '' });
      fetchTransactions();
      fetchBooks(); // refresh available counts
    } catch (err) {
      alert(err.response?.data?.error || 'Error borrowing book');
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    if (!returnForm.transactionId) return alert('Select a transaction');
    try {
      await api.post('/transactions/return', returnForm);
      setReturnForm({ transactionId: '' });
      fetchTransactions();
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.error || 'Error returning book');
    }
  };

  return (
    <div>
      <h2>Borrow / Return</h2>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Borrow Form */}
        <div style={{ border: '1px solid #ccc', padding: '20px', flex: 1 }}>
          <h3>📤 Borrow a Book</h3>
          <form onSubmit={handleBorrow}>
            <select name="bookId" value={borrowForm.bookId} onChange={handleBorrowChange} required>
              <option value="">Select Book</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} (Available: {b.available})
                </option>
              ))}
            </select>
            <br /><br />
            <select name="memberId" value={borrowForm.memberId} onChange={handleBorrowChange} required>
              <option value="">Select Member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
            <br /><br />
            <button type="submit">Borrow</button>
          </form>
        </div>

        {/* Return Form */}
        <div style={{ border: '1px solid #ccc', padding: '20px', flex: 1 }}>
          <h3>📥 Return a Book</h3>
          <form onSubmit={handleReturn}>
            <select value={returnForm.transactionId} onChange={handleReturnChange} required>
              <option value="">Select Active Borrow</option>
              {transactions.filter(t => t.status === 'borrowed').map((t) => (
                <option key={t.id} value={t.id}>
                  {t.Book?.title} - {t.Member?.name} (Due: {t.dueDate})
                </option>
              ))}
            </select>
            <br /><br />
            <button type="submit">Return</button>
          </form>
        </div>
      </div>

      <h3 style={{ marginTop: '30px' }}>Transaction History</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Book</th>
            <th>Member</th>
            <th>Borrowed</th>
            <th>Due</th>
            <th>Returned</th>
            <th>Fine ($)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.Book?.title}</td>
              <td>{t.Member?.name}</td>
              <td>{t.borrowDate}</td>
              <td>{t.dueDate}</td>
              <td>{t.returnDate || '-'}</td>
              <td>{t.fine}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionManager;