import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env['PORT'] || '3001', 10),
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  DB_HOST: requireEnv('DB_HOST'),
  DB_PORT: parseInt(process.env['DB_PORT'] || '3306', 10),
  DB_NAME: requireEnv('DB_NAME'),
  DB_USER: requireEnv('DB_USER'),
  DB_PASSWORD: requireEnv('DB_PASSWORD'),
  DB_SSL: process.env['DB_SSL'] === 'true',
  JWT_ACCESS_SECRET: requireEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
  CORS_ORIGIN: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  COOKIE_DOMAIN: process.env['COOKIE_DOMAIN'] || 'localhost',
  HF_API_TOKEN: process.env['HF_API_TOKEN'],
};
