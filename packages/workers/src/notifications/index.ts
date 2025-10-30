import 'dotenv/config';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
} as any);
export const emailQueue = new Queue('email', { connection });
export const whatsappQueue = new Queue('whatsapp', { connection });

new Worker('email', async (job) => { console.log('send email', job.data); }, { connection });
new Worker('whatsapp', async (job) => { console.log('send whatsapp', job.data); }, { connection });
