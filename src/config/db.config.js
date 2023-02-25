const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {

  async dbConnect() {
    const config = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: true
    }

    const client = new Client(config);
    await client.connect();

    return client;
  }
}
