const express = require('express');
const { Transaction, Book, Member } = require('../models/index');
const { Op } = require('sequelize');
const router = express.Router();

// Get all transactions (with book & member details)
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [Book, Member],
            order: [['borrowDate', 'DESC']],
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Borrow a book
router.post('/borrow', async (req, res) => {
    try {
        const { bookId, memberId } = req.body;

        const book = await Book.findByPk(bookId);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        if (book.available <= 0) {
            return res.status(400).json({ error: 'No copies available' });
        }

        const member = await Member.findByPk(memberId);
        if (!member) return res.status(404).json({ error: 'Member not found' });

        // Check if member already has an overdue book (optional strict rule)
        // We'll allow multiple borrows but enforce availability.

        // Decrement available count
        await book.decrement('available');

        // Calculate due date (14 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        const transaction = await Transaction.create({
            bookId,
            memberId,
            borrowDate: new Date(),
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'borrowed',
        });

        const fullTransaction = await Transaction.findByPk(transaction.id, {
            include: [Book, Member],
        });
        res.status(201).json(fullTransaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Return a book
router.post('/return', async (req, res) => {
    try {
        const { transactionId } = req.body;

        const transaction = await Transaction.findByPk(transactionId, {
            include: [Book],
        });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        if (transaction.status === 'returned') {
            return res.status(400).json({ error: 'Book already returned' });
        }

        const returnDate = new Date();
        const dueDate = new Date(transaction.dueDate);

        // Calculate fine: $1 per day late
        let fine = 0;
        if (returnDate > dueDate) {
            const diffTime = Math.abs(returnDate - dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const FINE_PER_DAY = process.env.FINE_PER_DAY || 1.0;
            fine = diffDays * FINE_PER_DAY;
        }

        // Update transaction
        await transaction.update({
            returnDate: returnDate.toISOString().split('T')[0],
            fine: fine,
            status: 'returned',
        });

        // Increment available books
        await transaction.Book.increment('available');

        const updatedTransaction = await Transaction.findByPk(transaction.id, {
            include: [Book, Member],
        });
        res.json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});
// Pay fine (set fine to 0)
router.put('/:id/pay-fine', async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        if (transaction.fine === 0) {
            return res.status(400).json({ error: 'No fine to pay' });
        }
        transaction.fine = 0;
        await transaction.save();
        res.json({ message: 'Fine paid successfully', transaction });
    } catch (error) {
        console.error('Pay fine error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

module.exports = router;