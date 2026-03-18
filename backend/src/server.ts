import http from 'http';
import app from './app';
import { env } from './config/env';
import db from './config/db';

async function start() {
  try {
    // Test DB connection
    await db.raw('SELECT 1');
    console.log('✅ Database connected');

    const server = http.createServer(app);
    server.listen(env.PORT, () => {
      console.log(`🚀 LMS Backend running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
