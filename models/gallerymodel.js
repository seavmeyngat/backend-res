const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Gallery = sequelize.define('Gallery', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Publish', 'Draft'),
    defaultValue: 'Draft',
    allowNull: false,
  },
  uploaded_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  alt_text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.STRING, // or TEXT, storing comma-separated tags
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  underscored: false,
  tableName: 'galleries',
  paranoid: true, // enable soft deletes with deletedAt
});

module.exports = Gallery;

  