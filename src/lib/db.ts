import { Pool } from 'pg';

let pool: Pool;

if (!pool) {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn('WARNING: DATABASE_URL is not set. Database connections will fail.');
  }

  pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
}

export default pool;
