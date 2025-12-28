// ============================================
// DATABASE CONFIGURATION
// File: config/database.js
// ============================================

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'gdgoc',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    return false;
  }
};

module.exports = { sequelize, testConnection };
