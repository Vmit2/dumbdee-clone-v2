import { Schema, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    acknowledged_by_seller: { type: Boolean, default: false },
    acknowledged_at: Date,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

export const ReviewModel = model("Review", ReviewSchema);
