import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  console.warn('WARNING: DATABASE_URL environment variable is not set. Database connections will fail.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
