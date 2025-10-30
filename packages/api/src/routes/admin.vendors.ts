import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { VendorModel } from "../models/Vendor";

export const adminVendorsRouter = Router();

adminVendorsRouter.get("/vendors", requireAuth(["admin"]), async (req, res) => {
  const { slug, limit = 100 } = req.query as any;
  const filter: any = {};
  if (slug) filter.slug = slug;
  const vendors = await VendorModel.find(filter).limit(Number(limit));
  if (slug) {
    return res.json(vendors[0] || null);
  }
  res.json(vendors);
});

adminVendorsRouter.get('/vendors/:id', requireAuth(['admin']), async (req, res) => {
  const v = await VendorModel.findById(req.params.id);
  if (!v) return res.status(404).json({ error: 'not_found' });
  res.json(v);
});

adminVendorsRouter.put('/vendors/:id', requireAuth(['admin']), async (req, res) => {
  const updated = await VendorModel.findByIdAndUpdate(req.params.id, req.body || {}, { new: true });
  res.json(updated);
});

adminVendorsRouter.put("/vendors/:id/approve", requireAuth(["admin"]), async (req, res) => {
  const doc = await VendorModel.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true });
  res.json(doc);
});

adminVendorsRouter.put("/vendors/:id/suspend", requireAuth(["admin"]), async (req, res) => {
  const doc = await VendorModel.findByIdAndUpdate(req.params.id, { status: "suspended" }, { new: true });
  res.json(doc);
});
