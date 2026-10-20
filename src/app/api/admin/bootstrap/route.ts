import prisma from "@/lib/db";
import { handle, ok, requireAdmin } from "@/lib/server/api";
import { toCategory, toCollection, toCoupon } from "@/lib/server/mappers";
import { expireUnpaidOrders } from "@/lib/server/orders";
import { razorpayConfigured } from "@/lib/server/razorpay";
import { getSettings } from "@/lib/server/settings";

export const dynamic = "force-dynamic";

/** The small, rarely-changing data the admin shell needs. Big lists (products, orders, customers) are paginated separately. */
export const GET = handle(async () => {
  await requireAdmin();
  await expireUnpaidOrders().catch(() => {});

  const [collections, categories, coupons, settings, unreadMessages, pendingOrders, perCategory] = await Promise.all([
    prisma.collection.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ orderBy: [{ collectionId: "asc" }, { sortOrder: "asc" }] }),
    prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }),
    getSettings(),
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.groupBy({ by: ["categoryId"], _count: { _all: true } }),
  ]);

  return ok({
    collections: collections.map(toCollection),
    categories: categories.map(toCategory),
    coupons: coupons.map(toCoupon),
    settings,
    unreadMessages,
    pendingOrders,
    categoryCounts: Object.fromEntries(perCategory.map((c) => [c.categoryId, c._count._all])),
    integrations: { razorpay: razorpayConfigured(), cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME, email: !!process.env.SMTP_HOST },
  });
});
