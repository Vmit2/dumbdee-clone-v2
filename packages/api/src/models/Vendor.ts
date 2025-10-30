import { Schema, model } from "mongoose";

const VendorSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["pending", "active", "suspended"], default: "pending" },
    payout_method: { type: String, enum: ["manual", "razorpay", "stripe_connect"], default: "manual" },
    settings: { type: Schema.Types.Mixed },
    images: {
      logo: String,
      banner: String
    }
  },
  { timestamps: true }
);

export const VendorModel = model("Vendor", VendorSchema);
