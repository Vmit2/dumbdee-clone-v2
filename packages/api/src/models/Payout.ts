import { Schema, model } from "mongoose";

const PayoutSchema = new Schema(
  {
    seller_id: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    commission_rate: { type: Number, default: 0 },
    period_start: Date,
    period_end: Date,
    status: { type: String, enum: ["requested", "approved", "paid", "rejected"], default: "requested" },
    provider: { type: String, enum: ["manual", "razorpay", "stripe_connect"], default: "manual" },
    notes: String
  },
  { timestamps: true }
);

export const PayoutModel = model("Payout", PayoutSchema);


