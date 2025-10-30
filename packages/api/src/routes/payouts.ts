import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { PayoutModel } from "../models/Payout";

export const payoutsRouter = Router();

payoutsRouter.get("/", requireAuth(["admin", "vendor"]), async (req, res) => {
  const { seller_id } = req.query as any;
  const filter: any = {};
  if (seller_id) filter.seller_id = seller_id;
  res.json(await PayoutModel.find(filter).limit(100));
});

payoutsRouter.post("/", requireAuth(["vendor", "admin"]), async (req, res) => {
  const created = await PayoutModel.create(req.body);
  res.status(201).json(created);
});

payoutsRouter.put("/:id/approve", requireAuth(["admin"]), async (req, res) => {
  const updated = await PayoutModel.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
  res.json(updated);
});

payoutsRouter.put("/:id/pay", requireAuth(["admin"]), async (req, res) => {
  const updated = await PayoutModel.findByIdAndUpdate(req.params.id, { status: "paid" }, { new: true });
  res.json(updated);
});


