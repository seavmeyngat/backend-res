const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const WeeklyMenu = sequelize.define('WeeklyMenu', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  menu_shift: {
    type: DataTypes.ENUM('breakfast', 'lunch', 'dinner'),
    allowNull: false,
  },
  from_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  to_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  english_menu_description: {
    type: DataTypes.TEXT,
  },
  khmer_menu_description: {
    type: DataTypes.TEXT,
  },
images_urls: {
    type: DataTypes.STRING,
  },

  created_by: {
    type: DataTypes.UUID,
  },
  updated_by: {
    type: DataTypes.UUID,
  },
  created_datetime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_datetime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'weekly_menu',
  timestamps: false,
});

module.exports = WeeklyMenu;
