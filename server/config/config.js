require('dotenv').config()

module.exports = {
  jwt_encryption: process.env.JWT_ENCRYPTION || 'jwt_online_shopping_app',
  jwt_expiration: process.env.JWT_EXPIRATION || '10000',
  development: {
    url: process.env.DEVS_DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
}