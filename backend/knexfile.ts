import { Knex } from 'knex';
import { env } from './src/config/env';

const isProd = env.NODE_ENV === 'production';

const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined,
  },
  migrations: {
    // In production, use compiled JS migrations to avoid compilation memory spikes
    directory: isProd ? './dist/migrations' : './migrations',
    extension: isProd ? 'js' : 'ts',
  },
  pool: { min: 2, max: 10 },
};

export default config;
