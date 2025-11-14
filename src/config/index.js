require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/GoCast',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'gocast-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};

module.exports = { config };



