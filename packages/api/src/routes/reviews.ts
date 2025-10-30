import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { ReviewModel } from "../models/Review";

export const reviewsRouter = Router();

reviewsRouter.get("/", async (req, res) => {
  const { product_id } = req.query as any;
  const filter: any = {};
  if (product_id) filter.product_id = product_id;
  res.json(await ReviewModel.find(filter).limit(100));
});

reviewsRouter.post("/", requireAuth(["customer", "admin"]), async (req, res) => {
  const created = await ReviewModel.create(req.body);
  res.status(201).json(created);
});

reviewsRouter.put("/:id/ack", requireAuth(["vendor", "admin"]), async (req, res) => {
  const updated = await ReviewModel.findByIdAndUpdate(req.params.id, { acknowledged_by_seller: true, acknowledged_at: new Date() }, { new: true });
  res.json(updated);
});

reviewsRouter.put("/:id", requireAuth(["admin"]), async (req, res) => {
  const updated = await ReviewModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});


