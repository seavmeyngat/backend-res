const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const OpeningHour = sequelize.define('opening_hours', {
  opening_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  uploaded_by: {
    type: DataTypes.UUID,
    allowNull: false
  },
  day_of_week: {
    type: DataTypes.ENUM(
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ),
    allowNull: false
  },
  open_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  close_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'opening_hours',
  timestamps: true,
  underscored: true
});

module.exports = OpeningHour;
