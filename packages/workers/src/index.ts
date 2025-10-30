import "dotenv/config";
import { Queue, Worker, JobsOptions } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null
} as any);

export const bulkUploadQueue = new Queue("bulk-upload", { connection });

export type BulkUploadJobData = {
  vendorId: string;
  s3Key: string;
};

export function enqueueBulkUpload(data: BulkUploadJobData, opts?: JobsOptions) {
  return bulkUploadQueue.add("process-csv", data, { attempts: 3, backoff: 5000, ...(opts || {}) });
}

new Worker(
  "bulk-upload",
  async (job) => {
    console.log("Processing bulk upload", job.data);
    // TODO: download CSV from S3, parse, create products via API
  },
  { connection }
);

console.log("Workers started");
