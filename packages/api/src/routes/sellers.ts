import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { SellerModel } from "../models/Seller";

export const sellersRouter = Router();

sellersRouter.get("/", requireAuth(["admin"]), async (_req, res) => {
  res.json(await SellerModel.find({}).limit(100));
});

sellersRouter.post("/", requireAuth(["admin", "vendor", "staff"]), async (req, res) => {
  const created = await SellerModel.create(req.body);
  res.status(201).json(created);
});

sellersRouter.get("/:id", requireAuth(["admin", "vendor", "staff"]), async (req, res) => {
  const seller = await SellerModel.findById(req.params.id);
  if (!seller) return res.status(404).json({ error: "not_found" });
  res.json(seller);
});

sellersRouter.put("/:id", requireAuth(["admin", "vendor", "staff"]), async (req, res) => {
  const updated = await SellerModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

sellersRouter.delete("/:id", requireAuth(["admin"]), async (req, res) => {
  await SellerModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});


