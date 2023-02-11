const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // connection: pgp(process.env.DB_URL)
  }
}