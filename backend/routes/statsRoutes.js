const express = require('express');
const { Book, Member, Transaction } = require('../models/index');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const totalMembers = await Member.count();
    const borrowedCount = await Transaction.count({ where: { status: 'borrowed' } });

    // Overdue: borrowed transactions where dueDate < today
    const today = new Date().toISOString().split('T')[0];
    const overdueCount = await Transaction.count({
      where: {
        status: 'borrowed',
        dueDate: { [Op.lt]: today },
      },
    });

    res.json({
      totalBooks,
      totalMembers,
      borrowedCount,
      overdueCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;