import knex from 'knex';
import { env } from './env';

const db = knex({
  client: 'mysql2',
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined,
  },
  pool: { min: 2, max: 10 },
});

export default db;
