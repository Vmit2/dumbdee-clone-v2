import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { VendorModel } from "../../models/Vendor";
import { ProductModel } from "../../models/Product";

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

vendorRouter.post("/products", requireAuth(["vendor", "admin"]), async (req, res) => {
  const body = req.body || {};
  if (!body.vendor_id || !body.title || !body.slug) return res.status(400).json({ error: "invalid_body" });
  const created = await ProductModel.create(body);
  res.status(201).json(created);
});

vendorRouter.post("/products/bulk-upload", requireAuth(["vendor", "admin"]), async (_req, res) => {
  res.status(202).json({ queued: true });
});
