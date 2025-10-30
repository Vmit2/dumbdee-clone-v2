import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    role: { type: String, enum: ["superadmin", "admin", "support", "vendor", "customer", "staff"], default: "customer" },
    auth_provider: {
      provider: String,
      provider_id: String
    },
    meta: Schema.Types.Mixed,
    addresses: [{
      label: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
      is_default: { type: Boolean, default: false }
    }],
    payment_methods: [{
      provider: String,
      token: String,
      last4: String,
      brand: String,
      exp_month: Number,
      exp_year: Number,
      is_default: { type: Boolean, default: false }
    }]
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);
