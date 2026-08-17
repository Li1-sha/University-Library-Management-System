const sequelize = require('../config/db');
const Book = require('./Book');
const Member = require('./Member');
const Transaction = require('./Transaction');

// Associations
Book.hasMany(Transaction, { foreignKey: 'bookId' });
Transaction.belongsTo(Book, { foreignKey: 'bookId' });

Member.hasMany(Transaction, { foreignKey: 'memberId' });
Transaction.belongsTo(Member, { foreignKey: 'memberId' });

// Sync database (creates tables if they don't exist)
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await sequelize.sync({ alter: true }); // Use { force: true } to drop & recreate
    console.log('Models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, Book, Member, Transaction, syncDatabase };