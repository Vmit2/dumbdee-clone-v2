import { Router } from "express";
import { VendorModel } from "../models/Vendor";
import { ProductModel } from "../models/Product";
import { SettingsModel } from "../models/Settings";

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

publicRouter.post("/newsletter", async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "missing_email" });
  // Stub: accept and no-op
  res.status(202).json({ ok: true });
});

publicRouter.get("/posts", async (_req, res) => {
  res.json([
    { slug: 'welcome', title: 'Welcome to DumbDee', excerpt: 'News and updates', published_at: new Date().toISOString() }
  ]);
});

publicRouter.get('/marketing/popup', async (_req, res) => {
  const s = await SettingsModel.findOne();
  res.json(s?.themes?.marketing?.popup || { enabled: false, message: '' });
});

publicRouter.get('/geo', async (req, res) => {
  // Simple stub using accept-language; defaults to IN/INR
  const lang = String(req.headers['accept-language'] || 'en-IN');
  const region = lang.includes('US') ? 'US' : lang.includes('EU') ? 'EU' : 'IN';
  const currency = region === 'US' ? 'USD' : region === 'EU' ? 'EUR' : 'INR';
  res.json({ region, currency });
});

publicRouter.get('/featured', async (_req, res) => {
  const s = await SettingsModel.findOne();
  const ids: string[] = s?.themes?.featured?.product_ids || [];
  if (!ids.length) return res.json([]);
  const products = await ProductModel.find({ _id: { $in: ids } });
  // preserve order from settings
  const byId = new Map(products.map((p: any)=> [String(p._id), p]));
  const ordered = ids.map((id)=> byId.get(String(id))).filter(Boolean);
  res.json(ordered);
});

publicRouter.get('/trending', async (_req, res) => {
  // Simple stub: return newest products as trending
  const products = await ProductModel.find({}).sort({ createdAt: -1 }).limit(8);
  res.json(products);
});


