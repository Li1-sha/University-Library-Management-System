const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  membershipDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Member;