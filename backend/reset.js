/**
 * reset.js — Railway Database Reset Script
 *
 * Usage:
 *   node reset.js
 *
 * This script drops all tables, re-runs migrations, and seeds fresh data.
 * Run this on Railway by connecting locally with DATABASE_URL set in .env.
 *
 * Railway Dashboard alternative:
 *   1. Open Railway > your Postgres service > Query tab
 *   2. Paste: DROP SCHEMA public CASCADE; CREATE SCHEMA public;
 *   3. Then run: node migrate.js && node seed.js
 */

const { pool } = require('./db');

const reset = async () => {
  try {
    console.log('Dropping all tables...');
    await pool.query(`
      DROP TABLE IF EXISTS notifications  CASCADE;
      DROP TABLE IF EXISTS quests         CASCADE;
      DROP TABLE IF EXISTS blood_requests CASCADE;
      DROP TABLE IF EXISTS users          CASCADE;
      DROP TABLE IF EXISTS hospitals      CASCADE;
    `);
    console.log('All tables dropped.');
    console.log('');
    console.log('Next steps:');
    console.log('  node migrate.js   — recreate schema');
    console.log('  node seed.js      — populate test data');
  } catch (error) {
    console.error('Reset failed:', error);
  } finally {
    pool.end();
  }
};

reset();
