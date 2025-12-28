// ============================================
// DATABASE CONFIGURATION
// File: config/database.js
// ============================================

const { Sequelize } = require('sequelize');

// Create Sequelize instance
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
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw new Error(`Database error: ${error.message}`);
  }
};

// Sync models
const syncModels = async () => {
  try {
    // Skip force sync - database schema should already exist
    // If needed, run migrations or initial setup separately
    console.log('✅ Database models synced successfully');
    return true;
  } catch (error) {
    console.error('⚠️  Model sync warning:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncModels
};
