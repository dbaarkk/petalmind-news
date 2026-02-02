import cron from 'node-cron';
import { ingestFeeds } from '../src/lib/ingest.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Running scheduled ingestion...');
  await ingestFeeds();
});

// Run once immediately on start
console.log('Starting ingestion worker...');
ingestFeeds();
