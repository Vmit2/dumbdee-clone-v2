## Marketplace MVP Requirements (Derived)

- Tech: Next.js (TS) apps: storefront, vendor-portal, admin-portal; Express API (TS); MongoDB Atlas; Redis+BullMQ; S3 presigned uploads; Okta/Auth0 OIDC; Razorpay+Stripe; Shiprocket/Shipway plugins; SendGrid + WhatsApp; GA4 + Meta Pixel; Jest+Supertest+Playwright; GitHub Actions; Docker; Redux Toolkit shared store (`@dumbdee/common-frontend`).
- Feature flags (global + per vendor): vendor_bulk_upload, vendor_video_upload, vendor_withdrawals, vendor_shipping_management, vendor_product_auto_approval, allow_vendor_theme_override, product_sequence_enabled, auto_send_whatsapp, analytics_enabled, enable_meta_pixel, enable_server_side_analytics, allow_vendor_download_template, vendor_chat.
- Core flows (Phase 1): Vendor signup & approval; Product CRUD; Bulk upload CSV (S3 + worker); Video uploads (S3 + notify); Storefront listing/product page; Checkout (Razorpay sandbox); Auth middleware with roles.
- Phase 2: Payouts, shipping, product sequencing, themes.
- Phase 3: Analytics server-side, E2E, perf.
- Data models: users, vendors/sellers, products (variants, videos, seo, regions, seasons), orders (multi-vendor line items), reviews, payouts, templates, product_sequence, settings.features, themes, config, audit_logs.
- APIs: uploads/presign, vendor products CRUD, vendor bulk upload, admin settings & themes, product sequencing endpoints, webhooks (Razorpay/shipway) later.
- Deploy: Vercel frontends; EC2 backend via dev-deployer.

## Universal System Features (parity scope)

- Authentication: Okta/OAuth (admin, seller, buyer) with RBAC (SuperAdmin, Admin, Seller, Buyer, Support)
- Regions: multi-region, multi-currency, tax rules per region/category
- Commerce Core: Medusa-based modules for cart/checkout where applicable
- Storage: MongoDB Atlas; S3 for media (images, videos, KYC)
- Notifications: Email (SendGrid) + WhatsApp (Gupshup/Twilio)
- Analytics: GA4 + Meta Pixel, client and server events, feature-gated
- Deploy: Backend on EC2 (dev-deployer profile); Frontends on Vercel
- Config: Feature toggles & theme overrides via SuperAdmin; seasonal themes (6 presets)
- Ops: Audit logs, worker queues, cron jobs; health checks and maintenance mode
- QA: Jest + Supertest + Playwright with target coverage ≥ 90%

## New/Updated Dependencies

- Server: jose, passport (if needed), medusa components, aws-sdk v2/3, bullmq, mongoose, sendgrid, twilio/gupshup SDKs, razorpay, stripe
- Frontend: `@dumbdee/common-frontend` (shared UI + themes), next-seo, shadcn/ui (or equivalent), GA/Pixel snippets

## Routes and Endpoints (high-level)

- Auth: OIDC middleware `packages/api/src/middleware/auth.ts` (roles guard), audit `middleware/audit.ts`
- Settings/Features: GET/PUT `/api/v1/features`, GET/PUT `/api/v1/themes`
- Products: CRUD `/api/v1/products`, approval `/api/v1/admin/products/*`, sequencing `/api/v1/admin/sequence`
- Vendors: CRUD `/api/v1/admin/vendors`, seller profile `/api/v1/vendor/*`
- Uploads: GET `/api/v1/uploads/presign` (image/video)
- Orders: `/api/v1/orders` (multi-vendor line items)
- Payments: `/api/v1/payments/*` (intents, webhooks) for Razorpay/Stripe
- Shipping: `/api/v1/shipping/*` (rates, label stubs), Shipway provider interface
- Reviews: `/api/v1/reviews` (create/list/respond)
- Wishlist: `/api/v1/wishlist/*`
- Coupons: `/api/v1/coupons/*`
- Health/Maintenance: `/health`, maintenance guard middleware

## Frontend Routes

- Storefront: `/`, `/shop`, `/category/[slug]`, `/products/[slug]`, `/cart`, `/checkout`, `/orders`, `/wishlist`, `/profile`, `/help`
- Seller: `/dashboard`, `/products`, `/products/new`, `/bulk-upload`, `/orders`, `/payouts`, `/reviews`, `/coupons`, `/settings`
- Admin: `/overview`, `/sellers`, `/products`, `/orders`, `/customers`, `/discounts`, `/themes`, `/shipping`, `/taxes`, `/payouts`, `/analytics`, `/reports`, `/notifications`, `/marketing`, `/reviews`, `/integrations`, `/logs`, `/features`, `/maintenance`, `/dev`

## Implementation Notes

- Use Medusa modules for cart/checkout; wire to existing orders schema (multi-vendor line items)
- Feature gates via `Settings.features` and `middleware/flags.ts` on BE; shared gating in FE via context provider
- Theme presets (6) exported from `@dumbdee/common-frontend` and selectable per-region/seller
- Server-side analytics events gated by `enable_server_side_analytics`
- All deployments must use AWS `dev-deployer` profile for backend EC2
