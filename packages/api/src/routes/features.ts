import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { SettingsModel } from "../models/Settings";

export const featuresRouter = Router();

featuresRouter.get("/", async (_req, res) => {
  try {
    const doc = await SettingsModel.findOne();
    return res.json(doc?.features || {});
  } catch {
    return res.json({});
  }
});

featuresRouter.put("/", requireAuth(["admin"]), async (req, res) => {
  const doc = await SettingsModel.findOneAndUpdate({}, { features: req.body }, { upsert: true, new: true });
  res.json(doc.features);
});


