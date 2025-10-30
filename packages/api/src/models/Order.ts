import { Schema, model } from "mongoose";

const LineItemSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product" },
    variant_id: String,
    qty: Number,
    price: Number,
    vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor" }
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    items: [LineItemSchema],
    total: Number,
    currency: { type: String, default: "INR" },
    payment_status: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" },
    shipping_status: { type: String, enum: ["pending", "shipped", "delivered", "returned"], default: "pending" },
    fraud_flag: { type: Boolean, default: false },
    fraud_score: { type: Number, default: 0 },
    refunds: [{
      amount: Number,
      currency: String,
      reason: String,
      status: { type: String, enum: ["requested", "approved", "rejected", "processed"], default: "requested" },
      created_at: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

export const OrderModel = model("Order", OrderSchema);
