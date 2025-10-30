import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { VendorModel } from "../../models/Vendor";
import { ProductModel } from "../../models/Product";
import { CouponModel } from "../../models/Coupon";
import { OrderModel } from "../../models/Order";

export const vendorRouter = Router();

vendorRouter.post("/register", requireAuth(["vendor", "admin", "customer"]), async (req, res) => {
  const body = req.body || {};
  const vendor = await VendorModel.create({
    user_id: body.user_id,
    slug: body.slug,
    name: body.name,
    status: "pending"
  });
  res.status(201).json(vendor);
});

vendorRouter.get("/me", requireAuth(["vendor", "admin"]), async (_req, res) => {
  const vendor = await VendorModel.findOne();
  res.json(vendor);
});

vendorRouter.put("/me", requireAuth(["vendor", "admin"]), async (req, res) => {
  const { vendor_id, name, settings, images } = req.body || {};
  if (!vendor_id) return res.status(400).json({ error: "missing_vendor_id" });
  const updated = await VendorModel.findByIdAndUpdate(vendor_id, { $set: { name, settings, images } }, { new: true });
  res.json(updated);
});

vendorRouter.post("/products", requireAuth(["vendor", "admin"]), async (req, res) => {
  const body = req.body || {};
  if (!body.vendor_id || !body.title || !body.slug) return res.status(400).json({ error: "invalid_body" });
  const created = await ProductModel.create(body);
  res.status(201).json(created);
});

vendorRouter.post('/products/:id/clone', requireAuth(['vendor','admin']), async (req, res) => {
  const src = await ProductModel.findById(req.params.id);
  if (!src) return res.status(404).json({ error: 'not_found' });
  const copy = src.toObject();
  delete (copy as any)._id;
  copy.slug = copy.slug + '-copy-' + Math.floor(Math.random()*1000);
  copy.title = (copy.title || 'Product') + ' (Copy)';
  const created = await ProductModel.create(copy);
  res.status(201).json(created);
});

vendorRouter.post("/products/bulk-upload", requireAuth(["vendor", "admin"]), async (_req, res) => {
  res.status(202).json({ queued: true });
});

vendorRouter.post('/coupons', requireAuth(['vendor','admin']), async (req, res) => {
  const body = req.body || {};
  if (!body.vendor_id || !body.code || !body.value) return res.status(400).json({ error: 'invalid_body' });
  const created = await CouponModel.create({ vendor_id: body.vendor_id, code: body.code, type: body.type || 'percent', value: body.value, active: true });
  res.status(201).json(created);
});

vendorRouter.get('/orders', requireAuth(['vendor','admin']), async (req, res) => {
  const { vendor_id } = req.query as any;
  if (!vendor_id) return res.status(400).json({ error: 'missing_vendor_id' });
  const orders = await OrderModel.find({ 'items.vendor_id': vendor_id }).limit(100);
  res.json(orders);
});
