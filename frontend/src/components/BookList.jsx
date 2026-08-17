import React, { useState, useEffect } from 'react';
import api from '../api';

function BookList() {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({ title: '', author: '', isbn: '', quantity: 1 });

    useEffect(() => {
        fetchBooks();
        const handleSeed = () => fetchBooks();
        window.addEventListener('seedComplete', handleSeed);
        return () => window.removeEventListener('seedComplete', handleSeed);
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await api.get('/books');
            setBooks(res.data);
        } catch (err) {
            console.error('Error fetching books:', err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/books', { ...form, quantity: parseInt(form.quantity) });
            setForm({ title: '', author: '', isbn: '', quantity: 1 });
            fetchBooks();
        } catch (err) {
            console.error('Error adding book:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this book?')) return;
        try {
            await api.delete(`/books/${id}`);
            fetchBooks();
        } catch (err) {
            console.error('Error deleting book:', err);
        }
    };

    return (
        <div>
            <h2>Books</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
                <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required />
                <input name="quantity" type="number" placeholder="Qty" value={form.quantity} onChange={handleChange} required />
                <button type="submit">Add Book</button>
            </form>

            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Total</th>
                        <th>Available</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.isbn}</td>
                            <td>{book.quantity}</td>
                            <td>{book.available}</td>
                            <td>
                                <button onClick={() => handleDelete(book.id)} style={{ background: 'red', color: 'white', border: 'none' }}>
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

export default BookList;