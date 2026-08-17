const express = require('express');
const { Member } = require('../models/index');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const members = await Member.findAll();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const member = await Member.create({ name, email, phone });
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    const { name, email, phone } = req.body;
    await member.update({ name, email, phone });
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    await member.destroy();
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;