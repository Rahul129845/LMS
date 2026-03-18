// run-migrate.mjs  — ES module script to run Knex migrations
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { config } from 'dotenv';
config();

const require = createRequire(import.meta.url);
const Knex = require('knex');

const knex = Knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  },
  migrations: {
    directory: './migrations-js',
  },
});

console.log('Connecting to:', process.env.DB_HOST + ':' + process.env.DB_PORT);

knex.raw('SELECT 1')
  .then(() => {
    console.log('✅ DB connection OK');
    return knex.migrate.latest();
  })
  .then(([batchNo, migrations]) => {
    console.log(`✅ Migrations run (batch ${batchNo}):`, migrations);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  });
