import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSLMODE ? true : false,
}

let clientSql: Client | null;
let timer: NodeJS.Timeout | null = null;

function debounce(
  fn: Function,
  s: number
): void {
  if (timer) {
    timer.refresh();
  } else {
    timer = setTimeout(() => {
      timer = null;
      fn();
    }, s * 1000);
  }
}

export = {
  dbConfig,

  async dbConn(query: any) {
    console.info(query);

    debounce(() => {
      let temp = clientSql;
      clientSql = null;

      temp?.end();
      console.info('Connection sql closed');
    }, 60);

    if (!clientSql) {
      clientSql = new Client(dbConfig);
      await clientSql.connect();
    }

    return clientSql!.query(query);
  }
}
