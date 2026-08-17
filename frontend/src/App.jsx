import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BookList from './components/BookList';
import MemberList from './components/MemberList';
import TransactionManager from './components/TransactionManager';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <h1>📚 <span>University</span> Library System</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/books">Books</Link>
          <Link to="/members">Members</Link>
          <Link to="/transactions">Borrow / Return</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/transactions" element={<TransactionManager />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;