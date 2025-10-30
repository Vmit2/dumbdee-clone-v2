import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { OrderModel } from "../models/Order";

export const ordersRouter = Router();

ordersRouter.get("/", requireAuth(["admin", "staff", "vendor"]), async (req, res) => {
  const { refunds } = req.query as any;
  const filter: any = {};
  if (refunds === 'pending') {
    filter.refunds = { $elemMatch: { status: { $in: ['pending','requested'] } } };
  }
  if (refunds === 'approved') {
    filter.refunds = { $elemMatch: { status: 'approved' } };
  }
  res.json(await OrderModel.find(filter).limit(100));
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

ordersRouter.put("/:id/fraud", requireAuth(["admin", "staff"]), async (req, res) => {
  const { fraud_flag, fraud_score } = req.body || {};
  const updated = await OrderModel.findByIdAndUpdate(req.params.id, { $set: { fraud_flag: !!fraud_flag, fraud_score: Number(fraud_score||0) } }, { new: true });
  res.json(updated);
});

ordersRouter.post('/:id/refunds', requireAuth(['customer','admin','vendor']), async (req, res) => {
  const { amount, currency, reason } = req.body || {};
  const updated = await OrderModel.findByIdAndUpdate(req.params.id, { $push: { refunds: { amount, currency, reason, status: 'requested' } } }, { new: true });
  res.status(201).json(updated);
});

ordersRouter.put('/:id/refunds/:idx/approve', requireAuth(['admin','staff']), async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'not_found' });
  const idx = Number(req.params.idx);
  if (!order.refunds || !order.refunds[idx]) return res.status(404).json({ error: 'refund_not_found' });
  (order as any).refunds[idx].status = 'approved';
  await order.save();
  res.json(order);
});

ordersRouter.delete("/:id", requireAuth(["admin"]), async (req, res) => {
  await OrderModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});


