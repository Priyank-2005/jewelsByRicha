# Jewels by Richa — Project Blueprint & Backend Plan

> Same architecture as **Treasure Trove by Gurasim** (`D:\treasuretrove`) so we can reuse its proven pieces.
> Status: **Phase 1 (complete UI-only frontend) is done.** Everything below Phase 1 is the plan.

## 1. Brand & scope

| | |
|---|---|
| Brand | Jewels by Richa — *Timeless • Trendy • Yours* |
| USP | Anti-tarnish · Waterproof · Premium quality |
| Theme | Gold · Ivory · Black (tokens in `src/app/globals.css`) |
| Fonts | Cormorant Garamond (headings), Inter (body), Great Vibes (script accents) |
| Catalogue | 2 collections → 19 categories (see §3) |
| Admin | Dashboard · Products · Categories · Orders · Customers · Coupons |

**Open questions for the client:** exact Instagram handle, contact email/phone/address, shipping & COD fees,
free-shipping threshold, return policy wording, GST needs, real product photos, spelling of *Moissanite* categories.

## 2. Stack (identical to Treasure Trove)

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Framer Motion · Lucide · Recharts ·
Zod · Prisma + PostgreSQL (Neon in prod) · iron-session · bcryptjs · Razorpay · Cloudinary · Nodemailer.

## 3. Catalogue model

```
Collection  (Festive Collection | Anti Tarnish)
  └─ Category  (Kashmiri Watches, Necklaces, Heritage Bangle Kada, … | Mangalsutra, Bracelet Kada, …)
       └─ Product
```

Storefront URLs: `/shop` · `/collections/[collection]` · `/collections/[collection]/[category]` · `/product/[slug]`.
Collections are seeded (rarely change); categories are managed in **Admin → Categories**.

## 4. What exists today (frontend, mock data)

All state lives in `src/context/CatalogContext.tsx` (seed data + `localStorage`) — it is the **only** layer that
needs to change when the backend arrives; pages consume it through `useCatalog()`.

| Area | Routes |
|---|---|
| Storefront | `/`, `/shop`, `/collections/…`, `/product/[slug]`, `/cart`, `/checkout`, `/order-success`, `/wishlist`, `/about`, `/care`, `/faq`, `/contact`, `/shipping-returns`, `/privacy-policy`, `/terms` |
| Customer account | `/login`, `/account`, `/account/orders`, `/account/orders/[id]`, `/account/addresses`, `/account/profile` |
| Admin | `/admin/login`, `/admin`, `/admin/products` (+ `new`, `[id]`), `/admin/categories`, `/admin/orders` (+ `[id]`), `/admin/customers` (+ `[id]`), `/admin/coupons` |

Dummy data: 57 products (3 per category), 10 customers, 14 orders, 4 coupons. Products use illustrated SVG
placeholders (`ProductArt`) until real photos are uploaded — the `images[]` field already takes URLs.
Admin → "Reset demo data" restores the seed. Demo admin login accepts any password.

## 5. Database

Planned schema: [`prisma/schema.prisma`](prisma/schema.prisma). Key decisions (carried over from Treasure Trove):

- Prices stored as whole **rupees** (Int).
- Order lines and address are **snapshots**, not FKs — history survives product edits/deletes.
- Inventory is a single `stock` on Product (no variants in V1).
- One `User` table with a `Role` enum; guest checkout allowed (`Order.userId` nullable).
- Webhook events recorded by id for idempotency.
- New vs Treasure Trove: a `Collection` level above `Category`.

## 6. API surface (route handlers)

Public: `GET /api/products`, `/api/products/[slug]`, `/api/categories`, `POST /api/coupons/validate`, `POST /api/cart/validate`,
`POST /api/contact`, `POST /api/orders`.
Auth: `POST /api/auth/{register,verify-otp,login,logout,reset-password}`, `GET /api/auth/me`, `PUT /api/auth/profile`.
Customer: `/api/account/{addresses,orders}`, `/api/wishlist`.
Payments: `POST /api/payments/{create-order,verify,webhook}`.
Admin (all require `role === ADMIN`): `/api/admin/{products,categories,orders,customers,coupons,analytics,upload}`.

Every mutation validated with Zod; auth and admin endpoints rate-limited; orders created inside a Prisma
transaction that re-prices the cart server-side, re-validates the coupon and decrements stock atomically.

## 7. Auth & security

Email + password (bcrypt), OTP by email for registration and password reset only (6 digits, 10-min expiry,
3 attempts, single use). Sessions via `iron-session` (httpOnly, SameSite=Lax, secure in prod, 7 days).
Admin guarded by `src/proxy.ts` + per-route role checks. Security headers in `next.config.ts`; uploads limited to
5 MB images with MIME validation; **never trust client price or payment status** — the Razorpay webhook is authoritative.

## 8. Payments, media, email

- **Razorpay** (UPI, card; COD handled as an order with `paymentStatus = PENDING`). Test mode first.
- **Cloudinary** for product/category images — admin upload endpoint returns URLs stored in `ProductImage`.
- **Nodemailer** (SMTP) for OTP + order confirmation/shipped emails. Courier/tracking number is entered manually in admin.

## 9. Roadmap

| Phase | Work | Status |
|---|---|---|
| 1 | Complete frontend + admin UI with mock data | ✅ Done |
| 2 | Postgres + Prisma schema, migration, seed script (collections, categories, sample products) | Planned |
| 3 | Data-access layer (`src/lib/dal/*`) — port from Treasure Trove | Planned |
| 4 | Server auth: register/OTP/login/session, admin login | Planned |
| 5 | Products + categories APIs, replace `CatalogContext` reads with fetch/server components | Planned |
| 6 | Cart validation, coupons, checkout → order creation (transactional) | Planned |
| 7 | Razorpay test mode + webhook | Planned |
| 8 | Orders, customers, analytics admin APIs; emails | Planned |
| 9 | Cloudinary uploads, real product photos | Planned |
| 10 | Security pass, QA, production setup (Vercel + Neon + domain) | Planned |

**Reuse from Treasure Trove:** `lib/auth`, `otp`, `rate-limit`, `razorpay`, `cloudinary`, `email`, `pricing`, `coupons`,
`stock-reservation`, `dal/*`, `proxy.ts`, and the payment-confirmation flow — adapt names, add the Collection level.

## 10. Client services to set up (client-owned accounts)

Domain · Vercel · Neon (Postgres) · Razorpay · Cloudinary · email/SMTP provider.
