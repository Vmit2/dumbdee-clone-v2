import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { OrderModel } from "../models/Order";

export const ordersRouter = Router();

ordersRouter.get("/", requireAuth(["admin", "staff", "vendor"]), async (_req, res) => {
  res.json(await OrderModel.find({}).limit(100));
});

ordersRouter.get("/mine", requireAuth(["customer"]), async (req, res) => {
  const userId = (req as any).user?.sub;
  const rows = await OrderModel.find({ user_id: userId }).limit(100);
  res.json(rows);
});

ordersRouter.post("/", requireAuth(["admin", "customer"]), async (req, res) => {
  const created = await OrderModel.create(req.body);
  res.status(201).json(created);
});

ordersRouter.get("/:id", requireAuth(["admin", "staff", "vendor", "customer"]), async (req, res) => {
  const doc = await OrderModel.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "not_found" });
  res.json(doc);
});

ordersRouter.put("/:id", requireAuth(["admin", "staff"]), async (req, res) => {
  const updated = await OrderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

ordersRouter.delete("/:id", requireAuth(["admin"]), async (req, res) => {
  await OrderModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});


