import { Schema, model } from 'mongoose';

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    vendor_id: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    type: { type: String, enum: ['percent','flat'], default: 'percent' },
    value: { type: Number, required: true },
    min_amount: Number,
    starts_at: Date,
    ends_at: Date,
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CouponModel = model('Coupon', CouponSchema);


