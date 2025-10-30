import type { Request, Response, NextFunction } from 'express';
import { SettingsModel } from '../models/Settings';

let cachedFlags: any = null; let lastFetch = 0;

export async function loadFlags() {
  const now = Date.now();
  if (!cachedFlags || now - lastFetch > 30000) {
    const doc = await SettingsModel.findOne();
    cachedFlags = doc?.features || {};
    lastFetch = now;
  }
  return cachedFlags;
}

export function requireFeature(key: string) {
  return async (_req: Request, res: Response, next: NextFunction) => {
    const flags = await loadFlags();
    if (flags[key] === false) return res.status(403).json({ error: 'feature_disabled' });
    next();
  };
}

export async function maintenanceGuard(req: Request, res: Response, next: NextFunction) {
  const doc = await SettingsModel.findOne();
  const on = (doc as any)?.maintenance?.enabled;
  if (on && !req.headers.authorization) return res.status(503).json({ error: 'maintenance' });
  next();
}


