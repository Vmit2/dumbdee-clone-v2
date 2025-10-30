import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { SettingsModel } from "../models/Settings";

export const router = Router();

router.get("/settings", requireAuth(["admin"]), async (_req, res) => {
  const doc = await SettingsModel.findOne();
  res.json(doc || { features: {} });
});

router.put("/settings", requireAuth(["admin"]), async (req, res) => {
  const update = req.body || {};
  const doc = await SettingsModel.findOneAndUpdate({}, update, { upsert: true, new: true });
  res.json(doc);
});
