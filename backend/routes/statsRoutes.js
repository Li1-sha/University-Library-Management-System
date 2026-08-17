const express = require('express');
const { Book, Member, Transaction } = require('../models/index');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const totalMembers = await Member.count();
    const borrowedCount = await Transaction.count({ where: { status: 'borrowed' } });

    const today = new Date().toISOString().split('T')[0];
    const overdueCount = await Transaction.count({
      where: {
        status: 'borrowed',
        dueDate: { [Op.lt]: today },
      },
    });

    // Safely get total fines – wrap in try/catch in case column is missing
    let totalFines = 0;
    try {
      totalFines = await Transaction.sum('fine', { 
        where: { status: 'returned', fine: { [Op.gt]: 0 } } 
      });
      if (!totalFines) totalFines = 0;
    } catch (sumError) {
      console.warn('Could not sum fines:', sumError.message);
      totalFines = 0;
    }

    res.json({
      totalBooks,
      totalMembers,
      borrowedCount,
      overdueCount,
      totalFines,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;