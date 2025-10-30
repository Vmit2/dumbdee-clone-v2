import type { Request, Response, NextFunction } from 'express';
import mongoose, { Schema, model } from 'mongoose';

const AuditSchema = new Schema({
  at: { type: Date, default: Date.now },
  user: Schema.Types.Mixed,
  method: String,
  path: String,
  status: Number,
  meta: Schema.Types.Mixed
});
export const AuditModel = mongoose.models.Audit || model('Audit', AuditSchema);

export async function auditLog(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', async () => {
    try {
      await AuditModel.create({
        at: new Date(),
        user: (req as any).user || null,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        meta: { duration_ms: Date.now() - start }
      });
    } catch {}
  });
  next();
}


