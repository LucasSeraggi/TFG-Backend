import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NME,
  ssl: true
}

export = {
  dbConfig,

  async dbConn(query: any) {
    const client = new Client(dbConfig);
    await client.connect();

    return client.query(query);
  }
}
