## Feature Status Matrix (Backend/Frontend)

Legend: ✅ implemented, 🟡 partial/scaffold, ❌ pending

| Area | Feature | BE | FE | Notes |
|---|---|---:|---:|---|
| Auth | Okta/Auth0 OIDC with roles | ✅ | 🟡 | Middleware in BE; FE login flows pending |
| Storage | S3 presigned uploads (images/videos) | ✅ | 🟡 | BE presign; FE upload stubs on vendor portal |
| Vendors | Seller registration + profile (KYC, bank, GST) | 🟡 | ❌ | Models/routes exist; UI pending |
| Vendors | Seller approval/suspension (admin) | ✅ | ❌ | Admin routes present; admin UI pending |
| Vendors | Seller storefront page (/store/[slug]) | 🟡 | 🟡 | FE page scaffold; public vendor fetch needs public endpoint |
| Products | CRUD (variants, images, videos, SEO) | 🟡 | 🟡 | Models + basic CRUD; FE minimal list/detail; video processing worker stub |
| Products | Multi-category, multi-region, seasonal flags | ✅ | ❌ | Fields added; FE filters pending |
| Products | Bulk CSV upload (vendor) | 🟡 | 🟡 | Worker queue + vendor page stubs; processor pending |
| Products | Product approval workflow | 🟡 | ❌ | Status fields; admin UI/flow pending |
| Orders | Multi-vendor orders CRUD | 🟡 | ❌ | Model + routes; cart/checkout via Medusa pending |
| Payments | Razorpay + Stripe (checkout, webhooks) | 🟡 | ❌ | Intent + webhook routes added; UI and providers pending |
| Shipping | Shipway plugin interface | 🟡 | ❌ | Rates endpoint returns example rate; provider wiring pending |
| Reviews | Create, list, acknowledge by seller | ✅ | ❌ | Routes ready; FE UI pending |
| Payouts | Requests, approval, payment, commissions | 🟡 | ❌ | Model + routes; provider integration pending |
| Feature Flags | Global/per-vendor toggles | ✅ | 🟡 | Settings + routes; FE admin UI basic list only |
| Themes | Theme config, admin theme endpoints | ✅ | 🟡 | Admin themes routes; FE theming pending |
| Analytics | GA4 + Meta Pixel client + server | 🟡 | 🟡 | Client snippets done; server-side pending feature toggle wiring |

### Universal System (Shopify/Woo/WCFM parity)
| Area | Feature | BE | FE | Notes |
|---|---|---:|---:|---|
| Auth | Okta/OAuth for admin, seller, buyer | ✅ | 🟡 | BE `middleware/auth.ts`; FE login UIs pending |
| RBAC | SuperAdmin, Admin, Seller, Buyer, Support | 🟡 | ❌ | `User.role` enum; granular RBAC not complete |
| Regions | Multi-region, multi-currency, tax rules | 🟡 | ❌ | Models/fields exist; calculators pending |
| Core | Medusa-based commerce core + REST API | 🟡 | 🟡 | Medusa service scaffold; cart/checkout pending |
| Data | MongoDB persistence | ✅ | — | Mongoose models implemented |
| Media | S3 for images/videos/KYC | ✅ | 🟡 | Presign in BE; FE flows partial |
| Notify | Email + WhatsApp (SendGrid, Gupshup/Twilio) | 🟡 | ❌ | Worker routes/templates pending |
| Analytics | GA + Meta Pixel tracking | 🟡 | 🟡 | FE snippets exist; toggles/pipeline pending |
| Deploy | EC2 backend, Vercel frontends | 🟡 | 🟡 | Scripts scaffolded; env/targets pending |
| Config | Feature toggles & theme overrides (SuperAdmin) | ✅ | 🟡 | `Settings.features/themes`; Admin UI basic |
| Themes | Six gradient seasonal themes + editor | 🟡 | 🟡 | Presets pending in `@common-frontend`; admin editor stub |
| Ops | Audit logs, worker queues, cron jobs | 🟡 | ❌ | Audit middleware exists; workers scaffolded |
| QA | Test coverage ≥ 90% | ❌ | ❌ | Needs suites across API/FE/E2E |

### Storefront
| Area | Feature | BE | FE | Notes |
|---|---|---:|---:|---|
| UI | Responsive (mobile-first, shadcn + Tailwind) | — | 🟡 | Tailwind present; components partial |
| Nav | Home, Shop, Category, Product, Cart, Checkout, Orders, Wishlist, Profile, Help | 🟡 | 🟡 | Some pages scaffolded; cart/checkout missing |
| Media | Product videos & galleries from S3 | ✅ | 🟡 | Variants.videos in model; FE playback scaffold |
| SEO | OpenGraph + Schema.org | ❌ | ❌ | Pending `_metadata`/head tags |
| Search | Full text + filters (category, vendor, price, rating, tags) | 🟡 | ❌ | Basic listing; advanced filters pending |
| Filters | Attributes, collections, inventory, sale items | ❌ | ❌ | Pending models/queries |
| Recos | Related, trending, recently viewed | ❌ | ❌ | Pending analytics + cache |
| Currency | Multi-currency auto-switching (geo-IP) | ❌ | ❌ | Pending pricing service |
| Tax | Region-based tax calculation | ❌ | ❌ | Pending tax rules engine |
| Shipping | Calculators (Shipway, Shiprocket, custom) | 🟡 | ❌ | Provider interface stub only |
| Discounts | Coupon & discount code engine | ✅ | ❌ | Routes exist; FE apply flow pending |
| Credits | Gift cards and store credit | ❌ | ❌ | Pending models/routes |
| Lists | Wishlist and recently viewed | ✅ | ❌ | `wishlist.ts` route; FE page pending |
| Checkout | Guest checkout | ❌ | ❌ | Medusa/checkout integration pending |
| Accounts | Saved addresses and payment methods | ❌ | ❌ | Pending user address model |
| Orders | Order tracking with live status | 🟡 | ❌ | Status fields exist; FE tracking pending |
| Updates | Email/WhatsApp order updates | 🟡 | ❌ | Notification triggers pending |
| Loyalty | Loyalty & referral program | ❌ | ❌ | Pending design |
| Catalog | Multi-vendor storefront (by vendor or mixed) | 🟡 | 🟡 | Mixed listing; vendor pages scaffolded |
| Seller Pages | Vendor bio, ratings, policies | 🟡 | ❌ | Vendor model fields; FE page pending |
| Reviews | Reviews & Q/A (seller replies) | ✅ | ❌ | BE done; FE UI pending |
| UX | Product compare and quick-view modals | ❌ | ❌ | Pending FE |
| Merch | Cross-sell, upsell, bundles | ❌ | ❌ | Pending FE/BE |
| Recovery | Abandoned cart recovery | ❌ | ❌ | Pending jobs/emails |
| Marketing | Newsletter subscription & promo banners | ❌ | ❌ | Pending FE + API |
| Analytics | view_item, add_to_cart, purchase, view_collection | 🟡 | 🟡 | Partial client events |
| Themes | Dark/light toggle | 🟡 | 🟡 | To wire via common-frontend |
| i18n | Language and currency switcher | ❌ | ❌ | Pending config |
| A11y | ARIA compliance | ❌ | ❌ | Pending audit |
| Themes | Seasonal theme auto-apply (ThemeConfig) | ❌ | ❌ | Pending Settings + FE apply |
| Sequence | Custom product sequence ordering (admin) | ✅ | ❌ | Endpoint exists; FE apply pending |
| CMS | Blog / content pages (toggle) | ❌ | ❌ | Pending |
| Pay | Integrations: Razorpay, Stripe, PayPal sandbox | 🟡 | ❌ | Razorpay/Stripe stubs; PayPal TBD |

### Seller Dashboard
| Area | Feature | BE | FE | Notes |
|---|---|---:|---:|---|
| Onboarding | Seller onboarding, KYC upload (S3) | 🟡 | ❌ | Upload presign exists; UI missing |
| Profile | Address, bank, logo, theme | 🟡 | ❌ | Vendor model; FE form pending |
| Products | CRUD with variants/attributes/inventory/SKU/barcode | 🟡 | ❌ | Model supports variants; FE CRUD pending |
| Bulk | Bulk upload/download via CSV templates | 🟡 | 🟡 | Worker + page scaffold; template endpoint pending |
| Media | Product video & gallery uploads | ✅ | 🟡 | Presign + model; FE widget pending |
| SEO | Slug + meta | ✅ | 🟡 | Model fields; FE inputs pending |
| Drafts | Auto-save drafts | ❌ | ❌ | Pending FE autosave + status |
| Clone | Clone/copy products | ❌ | ❌ | Pending endpoint |
| Taxonomy | Category and tag assignment | 🟡 | ❌ | Fields present; FE selector pending |
| Types | Digital & physical product support | ❌ | ❌ | Pending |
| Status | draft / pending / published | ✅ | 🟡 | Enum present; FE flows pending |
| Orders | Order list & detailed view | 🟡 | ❌ | Routes exist; UI pending |
| Orders | Status updates: pending → shipped → delivered | 🟡 | ❌ | Model fields; UI actions pending |
| Shipments | Shipment creation (Shipway API) | 🟡 | ❌ | Provider interface stub |
| Tracking | Tracking numbers, labels, invoices | ❌ | ❌ | Pending |
| Refunds | Refund requests | ❌ | ❌ | Pending |
| Payouts | Balance overview, transactions, schedule | 🟡 | ❌ | Model/routes; UI pending |
| Commission | Commission overview | 🟡 | ❌ | Requires computation endpoint |
| Analytics | Sales, revenue, orders, product performance | ❌ | ❌ | Pending dashboards |
| Visitors | GA-based visitors | 🟡 | 🟡 | FE hooks missing |
| Reviews | Read/respond/flag reviews | ✅ | ❌ | Routes done; UI pending |
| Coupons | Coupons (if enabled) | ✅ | ❌ | Feature gate applies; FE pending |
| Policies | Store policies | ❌ | ❌ | Pending fields/UI |
| Staff | Staff accounts / permissions | ❌ | ❌ | Pending RBAC UI |
| Notify | Notifications center | 🟡 | ❌ | Worker + API pending |
| Toggles | Respect FeatureConfig | ✅ | 🟡 | Middleware present; FE gate pending |
| Theme | Theme override (banner, colors) | 🟡 | 🟡 | To wire presets from `@common-frontend` |
| Chat | Chat with admin/support | ❌ | ❌ | Pending |
| Exports | CSV exports (orders, products, payouts) | ❌ | ❌ | Pending |
| Security | Impersonation safeguard | 🟡 | ❌ | Admin endpoint pattern only |
| Support | Seller support ticketing | ❌ | ❌ | Pending |
| Plans | Seller subscription plans | ❌ | ❌ | Pending |
| Realtime | Real-time order alerts | ❌ | ❌ | Pending SSE/ws |
| QA | Integration tests for seller CRUD | 🟡 | ❌ | products.test.ts partial |

### Admin / Super Admin
| Area | Feature | BE | FE | Notes |
|---|---|---:|---:|---|
| Dashboard | Overview KPIs | ❌ | ❌ | Pending |
| Sellers | CRUD, approval, suspension, toggles | ✅ | ❌ | Routes exist; UI pending |
| KYC | Verification | 🟡 | ❌ | Model + files; UI pending |
| Payouts | Per-seller commissions/payouts | 🟡 | ❌ | Routes partial |
| Impersonate | Impersonate seller | 🟡 | ❌ | Guarded route pending |
| Products | Global list, approval, bulk edit, duplication | 🟡 | ❌ | Endpoints partial |
| Taxonomy | Category management (nested), tags, collections | ❌ | ❌ | Pending models/UI |
| Sequence | Drag-drop reorder | ✅ | ❌ | API exists; UI DnD pending |
| Media | Media viewer | ❌ | ❌ | Pending |
| Orders | All orders, edit/refund/cancel | 🟡 | ❌ | Some routes |
| Docs | Invoice, shipment, label generation | ❌ | ❌ | Pending |
| Fraud | Fraud detection and flags | ❌ | ❌ | Pending |
| Customers | List, orders, wishlists, segmentation | ❌ | ❌ | Pending |
| Broadcast | Email/WhatsApp broadcast | ❌ | ❌ | Pending |
| Discounts | Coupons, automatic discounts, BOGO, qty breaks, free ship | 🟡 | ❌ | Basic coupons exist |
| Themes | Manage preset themes; customize logo/colors/fonts | 🟡 | 🟡 | Endpoints exist; UI partial |
| Shipping | Carriers, zones, methods, overrides | 🟡 | ❌ | Provider interface only |
| Taxes | Rules per region/category | ❌ | ❌ | Pending engine |
| Finance | Manual/scheduled payouts; ledger export | 🟡 | ❌ | Routes partial |
| Analytics | Revenue, refunds, top sellers; GA/Pixel config UI | ❌ | ❌ | Pending |
| Reports | Sales/tax/commission/refunds; scheduled emails | ❌ | ❌ | Pending |
| Notifications | Email + WhatsApp templates; test trigger | 🟡 | ❌ | Worker endpoints TBD |
| Marketing | Campaign builder, featured products, banners, pop-ups | ❌ | ❌ | Pending |
| Reviews | Approve/flag/delete; respond as admin | 🟡 | ❌ | Reviews routes exist |
| Webhooks | Manage/test webhooks; ERP/CRM sync | ❌ | ❌ | Pending |
| Logs | Audit log viewer & export; API/error logs | 🟡 | ❌ | Audit middleware present |
| Feature Toggles | Global & per-seller/region; live reload | ✅ | 🟡 | API done; live reload pending |
| Health | Service monitor (Mongo, Redis, S3, EC2) | 🟡 | ❌ | Health pings partial |
| Maintenance | Maintenance mode toggle | ✅ | 🟡 | Middleware exists; FE banner pending |
| Dev Tools | API keys, Swagger auto-update, data seeder/reset | 🟡 | ❌ | OpenAPI present; UI pending |
| E2E | Admin approve seller → publish → checkout | 🟡 | ❌ | Playwright skeleton |

### System & DevOps
| Area | Feature | BE | FE | Notes |
|---|---|---:|---:|---|
| CI/CD | Pipeline (lint/test/build) | ✅ | — | GitHub Actions present |
| Deploy | EC2 deploy (Node) with dev-deployer profile | 🟡 | — | Scripts/env pending |
| Deploy | Vercel deploy for frontends | 🟡 | 🟡 | Project config pending |
| Cache | Redis cache & job queue | 🟡 | — | BullMQ scaffolded |
| Cron | S3 cleanup cron | ❌ | — | Pending job |
| Backups | Automated backups | ❌ | — | Pending |
| Tests | Jest + Supertest + Playwright ≥ 90% | ❌ | ❌ | Needs coverage buildout |
| Seed | Test data seeders | ✅ | — | `scripts/seed.ts` available |
| Docs | Docs autogen: OpenAPI + Markdown summaries | 🟡 | — | OpenAPI present; autogen script pending |
| Report | missing_features_report.md | ✅ | — | File exists; keep updated |
| Notifications | Email (SendGrid), WhatsApp (Twilio/Gupshup) | 🟡 | ❌ | Worker queues added; providers/templates pending |
| Sequencing | Product sequence rules | ✅ | ❌ | Admin endpoints exist; FE application pending |
| Sequencing | Apply product sequence on listing | ✅ | ❌ | sort=sequence supported on products list |
| Wishlist | Customer wishlists | ✅ | ❌ | Model + routes; FE auth/UI pending |
| Coupons | Discount codes (admin-managed) | ✅ | ❌ | Model + routes; FE apply pending |
| Storefront | Product listing + product page w/ video | 🟡 | 🟡 | Working with seed; video playback scaffold |
| Storefront | Cart + checkout (Medusa) | ❌ | ❌ | Pending integration |
| Storefront | Region detection, multi-currency | ❌ | ❌ | Config model present; logic pending |
| Vendor Portal | Bulk upload page + template download | 🟡 | 🟡 | Page scaffold, presign flow; template endpoint pending |
| Vendor Portal | Product CRUD UI | ❌ | ❌ | Pending |
| Admin Portal | Feature toggles UI (global/vendor) | 🟡 | 🟡 | Basic list; edit controls pending |
| Admin Portal | Vendor management, product approvals | 🟡 | ❌ | Routes exist; UI pending |
| Media | Video processing (poster/transcode) | ❌ | ❌ | Worker hook stub only |
| Tests | Jest unit + Supertest API | 🟡 | ❌ | Config + a few tests; need coverage expansion |
| E2E | Playwright: bulk upload, video, checkout | 🟡 | ❌ | Skeleton only |
| CI/CD | GitHub Actions lint/test/build | ✅ | — | Pipeline added |
| Health | Healthcheck + maintenance mode | ✅ | — | GET /health + maintenanceGuard middleware |

### Coverage
- Unit/API tests present (seed + basic endpoints). Additional suites needed to reach ≥90%.
| Deploy | Backend EC2 (dev-deployer), Frontend Vercel | 🟡 | 🟡 | Scripts scaffolded; FE Vercel config pending |

### Summary
- Backend core models and routes for sellers/products/orders/reviews/payouts/features/themes are largely in place (many as MVP scaffolds). Payments, shipping, and Medusa cart/checkout remain pending. Workers exist for bulk and notifications but require processors/integrations.
- Frontends have minimal pages for storefront list/detail, vendor bulk upload, and admin feature listing; comprehensive UIs remain to be implemented.


