export type Role = "superadmin" | "admin" | "support" | "vendor" | "customer" | "staff";

export interface Vendor {
  _id: string;
  user_id: string;
  slug: string;
  name: string;
  status: "pending" | "active" | "suspended";
  payout_method?: "manual" | "razorpay" | "stripe_connect";
  settings?: Partial<Record<string, unknown>>;
}

export interface ProductVideoMeta {
  url: string;
  poster?: string;
  duration?: number;
  uploaded_at?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  weight?: number;
  images?: string[];
  videos?: ProductVideoMeta[];
}

export interface Product {
  _id: string;
  vendor_id: string;
  title: string;
  slug: string;
  description?: string;
  categories?: string[];
  tags?: string[];
  variants: ProductVariant[];
  status: "draft" | "pending_approval" | "published";
  created_at?: string;
}
