import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    role: { type: String, enum: ["admin", "vendor", "customer", "staff"], default: "customer" },
    auth_provider: {
      provider: String,
      provider_id: String
    },
    meta: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);
