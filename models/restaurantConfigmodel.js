const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust path as needed

const RestaurantConfig = sequelize.define('RestaurantConfig', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  restaurant_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  restaurant_logo_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  breakfast_from_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  breakfast_to_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  lunch_from_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  lunch_to_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_phone_1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_email_1: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  opening_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  footer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'restaurant_configs',
  timestamps: true,
  underscored: true,
});

module.exports = RestaurantConfig;
