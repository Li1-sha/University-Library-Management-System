const express = require('express');
const { Book } = require('../models/index');
const router = express.Router();

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, quantity } = req.body;
    const book = await Book.create({
      title,
      author,
      isbn,
      quantity: quantity || 1,
      available: quantity || 1,
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT (update) a book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    const { title, author, isbn, quantity } = req.body;
    await book.update({ title, author, isbn, quantity });
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;