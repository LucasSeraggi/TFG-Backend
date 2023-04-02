import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSLMODE == '' ? true : false,
}

export = {
  dbConfig,

  async dbConn(query: any) {
    console.info(query);
    const client = new Client(dbConfig);
    await client.connect();

    return client.query(query);
  }
}
