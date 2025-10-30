import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { SettingsModel } from "../models/Settings";

export const featuresRouter = Router();

featuresRouter.get("/", requireAuth(["admin"]), async (_req, res) => {
  const doc = await SettingsModel.findOne();
  res.json(doc?.features || {});
});

featuresRouter.put("/", requireAuth(["admin"]), async (req, res) => {
  const doc = await SettingsModel.findOneAndUpdate({}, { features: req.body }, { upsert: true, new: true });
  res.json(doc.features);
});


