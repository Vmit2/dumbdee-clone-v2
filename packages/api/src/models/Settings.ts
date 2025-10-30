import { Schema, model } from "mongoose";

const FeaturesSchema = new Schema(
  {
    vendor_bulk_upload: { type: Boolean, default: true },
    vendor_video_upload: { type: Boolean, default: true },
    vendor_withdrawals: { type: Boolean, default: true },
    vendor_shipping_management: { type: Boolean, default: false },
    vendor_product_auto_approval: { type: Boolean, default: false },
    allow_vendor_theme_override: { type: Boolean, default: false },
    product_sequence_enabled: { type: Boolean, default: true },
    auto_send_whatsapp: { type: Boolean, default: false },
    analytics_enabled: { type: Boolean, default: true },
    enable_meta_pixel: { type: Boolean, default: true },
    enable_server_side_analytics: { type: Boolean, default: false },
    allow_vendor_download_template: { type: Boolean, default: true },
    vendor_chat: { type: Boolean, default: false }
  },
  { _id: false }
);

const SettingsSchema = new Schema(
  {
    features: { type: FeaturesSchema, default: {} },
    themes: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const SettingsModel = model("Settings", SettingsSchema);
