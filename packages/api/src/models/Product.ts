import { Schema, model } from "mongoose";

const VideoSchema = new Schema(
  {
    url: { type: String, required: true },
    poster: String,
    duration: Number,
    uploaded_at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const VariantSchema = new Schema(
  {
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    stock: { type: Number, default: 0 },
    weight: Number,
    images: [String],
    videos: [VideoSchema]
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor", index: true, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    seo: {
      title: String,
      description: String,
      keywords: [String]
    },
    regions: [{ type: String }],
    seasons: [{ type: String }],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    tags: [String],
    variants: { type: [VariantSchema], default: [] },
    status: { type: String, enum: ["draft", "pending_approval", "published"], default: "draft" },
    sequence_priority: { type: Number }
  },
  { timestamps: true }
);

export const ProductModel = model("Product", ProductSchema);
