// models/Notification.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust path

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  notify_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notify_type: {
    type: DataTypes.ENUM('info', 'closed', 'full'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'notifications',
  timestamps: true,
  underscored: true,
});

module.exports = Notification;