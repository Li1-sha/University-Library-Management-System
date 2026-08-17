const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  borrowDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  returnDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  fine: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.ENUM('borrowed', 'returned'),
    defaultValue: 'borrowed',
  },
});

module.exports = Transaction;