import prisma from "@/lib/db";
import { handle, ok, requireAdmin } from "@/lib/server/api";
import { toCategory, toCollection, toCoupon, toCustomer, toOrder, toProduct } from "@/lib/server/mappers";
import { expireUnpaidOrders } from "@/lib/server/orders";
import { razorpayConfigured } from "@/lib/server/razorpay";
import { getSettings } from "@/lib/server/settings";
import type { ShippingAddress } from "@/types/shop";

export const dynamic = "force-dynamic";

/** Everything the admin panel shows, in one request. Lists are capped (latest 1,000 orders, 2,000 customers). */
export const GET = handle(async () => {
  await requireAdmin();
  await expireUnpaidOrders().catch(() => {});

  const [collections, categories, products, coupons, orders, users, settings, unreadMessages] = await Promise.all([
    prisma.collection.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ orderBy: [{ collectionId: "asc" }, { sortOrder: "asc" }] }),
    prisma.product.findMany({ include: { images: true }, orderBy: { createdAt: "desc" } }),
    prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 1000 }),
    prisma.user.findMany({ where: { role: "CUSTOMER" }, orderBy: { createdAt: "desc" }, take: 2000 }),
    getSettings(),
    prisma.contactMessage.count({ where: { handled: false } }),
  ]);

  // Show each customer's city / state from their most recent order
  const place = new Map<string, { city: string; state: string }>();
  for (const o of orders) {
    if (o.userId && !place.has(o.userId)) {
      const a = o.shippingAddress as unknown as ShippingAddress;
      place.set(o.userId, { city: a.city, state: a.state });
    }
  }

  return ok({
    collections: collections.map(toCollection),
    categories: categories.map(toCategory),
    products: products.map(toProduct),
    coupons: coupons.map(toCoupon),
    orders: orders.map(toOrder),
    customers: users.map((u) => toCustomer(u, place.get(u.id))),
    settings,
    unreadMessages,
    integrations: { razorpay: razorpayConfigured(), cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME, email: !!process.env.SMTP_HOST },
  });
});
