import { Schema, model } from "mongoose";

const ConfigSchema = new Schema(
  {
    regions: [{ code: String, currency: String }],
    taxes: { type: Schema.Types.Mixed },
    analytics: { ga_measurement_id: String, meta_pixel_id: String },
    vendor_overrides: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const ConfigModel = model("Config", ConfigSchema);
