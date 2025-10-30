import { Router } from "express";
import { ProductModel } from "../models/Product";
import { Schema, model } from "mongoose";
import { requireAuth } from "../middleware/auth";

export const router = Router();

const ProductSequenceSchema = new (Schema as any)({
  scope: String,
  criteria: (Schema as any).Types.Mixed,
  order: String,
  productOrder: [{ type: (Schema as any).Types.ObjectId, ref: "Product" }],
  priority: Number
});
const ProductSequenceModel = (model as any)("ProductSequence", ProductSequenceSchema);

router.get("/", async (req, res) => {
  const { category, vendor, slug, sort, limit = 20 } = req.query as any;
  const filter: any = {};
  if (category) filter.categories = category;
  if (vendor) filter.vendor_id = vendor;
  if (slug) filter.slug = slug;
  if (sort === "sequence") {
    // fetch matching rules and order
    const rules = await ProductSequenceModel.find({}).sort({ priority: -1 });
    const ids: string[] = [];
    for (const r of rules) {
      // simplistic criteria match (category/seller)
      const matchCat = r.criteria?.categoryIds?.includes?.(category);
      const matchSeller = r.criteria?.sellerIds?.includes?.(vendor);
      if ((category && matchCat) || (vendor && matchSeller) || r.scope === 'global') {
        for (const pid of (r.productOrder || [])) {
          const id = String(pid);
          if (!ids.includes(id)) ids.push(id);
        }
      }
    }
    const docs = await ProductModel.find(filter).limit(Number(limit));
    const byId = new Map(docs.map((d: any) => [String(d._id), d]));
    const ordered: any[] = [];
    ids.forEach((id) => { const p = byId.get(id); if (p) ordered.push(p); });
    // append remaining
    docs.forEach((p: any) => { if (!ids.includes(String(p._id))) ordered.push(p); });
    return res.json(ordered.slice(0, Number(limit)));
  }
  const products = await ProductModel.find(filter).limit(Number(limit));
  res.json(products);
});

router.post("/", requireAuth(["vendor", "admin"]), async (req, res) => {
  const body = req.body || {};
  if (!body.vendor_id || !body.title || !body.slug) return res.status(400).json({ error: "invalid_body" });
  const created = await ProductModel.create({
    vendor_id: body.vendor_id,
    title: body.title,
    slug: body.slug,
    description: body.description,
    variants: body.variants || [],
    status: body.status || "draft"
  });
  res.status(201).json(created);
});

router.get("/:id", async (req, res) => {
  const doc = await ProductModel.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "not_found" });
  res.json(doc);
});

router.put("/:id", requireAuth(["vendor", "admin"]), async (req, res) => {
  const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", requireAuth(["vendor", "admin"]), async (req, res) => {
  await ProductModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});
