import { Schema, model } from "mongoose";

const KycSchema = new Schema(
  {
    pan: String,
    gst: String,
    documents: [String],
    verified: { type: Boolean, default: false }
  },
  { _id: false }
);

const BankSchema = new Schema(
  {
    account_name: String,
    account_number: String,
    ifsc: String,
    upi: String
  },
  { _id: false }
);

const StoreSettingsSchema = new Schema(
  {
    logo: String,
    banner: String,
    theme_key: String,
    allow_whatsapp: { type: Boolean, default: true }
  },
  { _id: false }
);

const SellerSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["pending", "active", "suspended"], default: "pending" },
    kyc: KycSchema,
    bank: BankSchema,
    store: StoreSettingsSchema
  },
  { timestamps: true }
);

export const SellerModel = model("Seller", SellerSchema);


