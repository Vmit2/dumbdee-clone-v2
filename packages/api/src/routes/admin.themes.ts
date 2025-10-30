import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { ThemeModel } from "../models/Theme";

export const adminThemesRouter = Router();

adminThemesRouter.get('/themes', requireAuth(['admin']), async (_req, res) => {
  res.json(await ThemeModel.find({}).limit(20));
});

adminThemesRouter.put('/themes/:id', requireAuth(['admin']), async (req, res) => {
  const doc = await ThemeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});
