import { Router } from "express";
import { VendorModel } from "../models/Vendor";
import { ProductModel } from "../models/Product";

export const publicRouter = Router();

publicRouter.get("/vendors/:slug", async (req, res) => {
  const vendor = await VendorModel.findOne({ slug: req.params.slug });
  if (!vendor) return res.status(404).json({ error: "not_found" });
  res.json(vendor);
});

publicRouter.get("/products", async (req, res) => {
  const { category, vendor, slug, sort, limit = 20 } = req.query as any;
  const filter: any = {};
  if (category) filter.categories = category;
  if (vendor) filter.vendor_id = vendor;
  if (slug) filter.slug = slug;
  let query = ProductModel.find(filter).limit(Number(limit));
  if (sort === "newest") query = query.sort({ createdAt: -1 });
  const products = await query;
  res.json(products);
});


