# Jewels by Richa — Project Blueprint & Backend Plan

> Same architecture as **Treasure Trove by Gurasim** (`D:\treasuretrove`) so we can reuse its proven pieces.
> Status: **Phases 1–9 are built** (storefront, admin, database, auth, payments, uploads). Remaining: go-live setup with the client's own accounts (Phase 10).

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

## 4. What exists today

The frontend now runs on the real backend (no mock data). Routes: see `src/app`. API: see section 6. Notes on how it works:

- **Catalogue** is read from PostgreSQL in the store layout (server-rendered, SEO-friendly); admin edits show on the next page load.
- **Orders** are priced on the server from the database. The browser only sends product ids and quantities.
  Stock is decremented and the coupon consumed inside one transaction; cancelling restores both. Unpaid online orders are auto-cancelled after 1 hour.
- **Payments**: Razorpay checkout + signature check + Razorpay API check + webhook (idempotent). With no keys, a mock mode works in development only.
- **Auth**: customers (email + password, OTP on register / reset) and admin use separate iron-session cookies; `proxy.ts` guards pages, and every admin route re-checks the role in the database.
- **Guests** can check out; their orders attach to their account when they register or sign in with the same email.
- **Images**: Cloudinary when configured, otherwise `public/uploads` (development only). Uploads are type-checked by file signature.
- **Settings** (shipping fee, free-shipping limit, COD fee, contact details, homepage categories) are editable in the admin panel.

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
| 2 | Postgres + Prisma schema, migrations, seed | ✅ Done |
| 3 | Server helpers (`src/lib/server/*`): session, validation, orders, coupons, email | ✅ Done |
| 4 | Server auth: register/OTP/login/session, admin login | ✅ Done |
| 5 | Products + categories APIs, replace `CatalogContext` reads with fetch/server components | ✅ Done |
| 6 | Cart validation, coupons, checkout → order creation (transactional) | ✅ Done |
| 7 | Razorpay test mode + webhook | ✅ Done |
| 8 | Orders, customers, analytics admin APIs; emails | ✅ Done |
| 9 | Cloudinary uploads, real product photos | ✅ Done |
| 10 | Security pass, QA, production setup (Vercel + Neon + domain) | Next — needs client accounts |

**Reuse from Treasure Trove:** `lib/auth`, `otp`, `rate-limit`, `razorpay`, `cloudinary`, `email`, `pricing`, `coupons`,
`stock-reservation`, `dal/*`, `proxy.ts`, and the payment-confirmation flow — adapt names, add the Collection level.

## 10. Client services to set up (client-owned accounts)

Domain · Vercel · Neon (Postgres) · Razorpay · Cloudinary · email/SMTP provider.
