import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { Schema, model } from "mongoose";

const ProductSequenceSchema = new Schema(
  {
    scope: { type: String, enum: ["category", "seller", "global", "season"], required: true },
    criteria: Schema.Types.Mixed,
    order: { type: String, enum: ["manual", "most_sales", "newest", "custom"], default: "manual" },
    productOrder: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    priority: { type: Number, default: 0 }
  },
  { timestamps: true }
);
const ProductSequenceModel = model("ProductSequence", ProductSequenceSchema);

export const adminSequenceRouter = Router();

adminSequenceRouter.get("/product-sequence", requireAuth(["admin"]), async (_req, res) => {
  res.json(await ProductSequenceModel.find({}).limit(100));
});

adminSequenceRouter.post("/product-sequence", requireAuth(["admin"]), async (req, res) => {
  const created = await ProductSequenceModel.findOneAndUpdate({ scope: req.body.scope, criteria: req.body.criteria }, req.body, { upsert: true, new: true });
  res.status(201).json(created);
});
