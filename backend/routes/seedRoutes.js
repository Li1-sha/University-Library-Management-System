const express = require('express');
const { Book, Member, Transaction, sequelize } = require('../models/index');
const router = express.Router();

// Seed demo data
router.post('/', async (req, res) => {
    try {
        // Use a transaction to ensure everything succeeds or rolls back
        await sequelize.transaction(async (t) => {
            // Delete in correct order to avoid foreign key errors
            await Transaction.destroy({ where: {}, transaction: t });
            await Book.destroy({ where: {}, transaction: t });
            await Member.destroy({ where: {}, transaction: t });

            // Sample Books
            const books = await Book.bulkCreate([
                { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', quantity: 5, available: 5 },
                { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', quantity: 3, available: 3 },
                { title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', quantity: 4, available: 4 },
                { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0-14-143951-8', quantity: 2, available: 2 },
                { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0-316-76948-0', quantity: 3, available: 3 },
                { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0-547-92822-7', quantity: 6, available: 6 },
                { title: 'Fahrenheit 451', author: 'Ray Bradbury', isbn: '978-1-4516-7331-9', quantity: 2, available: 2 },
            ], { transaction: t });

            const members = await Member.bulkCreate([
                { name: 'Ahmed Al-Rawahi', email: 'ahmed@university.edu.om', phone: '99123456' },
                { name: 'Fatima Al-Balushi', email: 'fatima@university.edu.om', phone: '99234567' },
                { name: 'Khalid Al-Hasani', email: 'khalid@university.edu.om', phone: '99345678' },
                { name: 'Noora Al-Said', email: 'noora@university.edu.om', phone: '99456789' },
                { name: 'Sultan Al-Busaidi', email: 'sultan@university.edu.om', phone: '99567890' },
            ], { transaction: t });

            // Sample Transactions
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];

            // 14 days ago
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(today.getDate() - 14);
            const twoWeeksAgoStr = twoWeeksAgo.toISOString().split('T')[0];

            // 7 days ago
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];

            // 3 days ago
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(today.getDate() - 3);
            const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];

            // Future due date (7 days from now)
            const futureDue = new Date();
            futureDue.setDate(today.getDate() + 7);
            const futureDueStr = futureDue.toISOString().split('T')[0];

            // Overdue due date (6 days ago)
            const overdueDue = new Date();
            overdueDue.setDate(today.getDate() - 6);
            const overdueDueStr = overdueDue.toISOString().split('T')[0];

            await Transaction.bulkCreate([
                // Borrowed, not returned yet
                { bookId: books[0].id, memberId: members[0].id, borrowDate: twoWeeksAgoStr, dueDate: todayStr, status: 'borrowed' },
                { bookId: books[1].id, memberId: members[1].id, borrowDate: oneWeekAgoStr, dueDate: futureDueStr, status: 'borrowed' },
                // Returned on time
                { bookId: books[2].id, memberId: members[2].id, borrowDate: threeDaysAgoStr, dueDate: futureDueStr, returnDate: todayStr, status: 'returned', fine: 0 },
                // Returned late (fine = $6)
                { bookId: books[3].id, memberId: members[3].id, borrowDate: twoWeeksAgoStr, dueDate: overdueDueStr, returnDate: todayStr, status: 'returned', fine: 6 },
            ], { transaction: t });

            // Update available quantities for borrowed books
            const borrowedBooks = await Transaction.findAll({
                where: { status: 'borrowed' },
                transaction: t
            });

            for (const trans of borrowedBooks) {
                const book = await Book.findByPk(trans.bookId, { transaction: t });
                if (book && book.available > 0) {
                    await book.decrement('available', { by: 1, transaction: t });
                }
            }
        });

        res.json({ message: 'Demo data seeded successfully!' });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;