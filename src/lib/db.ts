import pg from 'pg';

const { Pool } = pg;

const connectionString = import.meta.env?.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Database URL is not defined');
}

export const db = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
