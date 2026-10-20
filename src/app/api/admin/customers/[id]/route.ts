import prisma from "@/lib/db";
import { ApiError, handle, ok, requireAdmin } from "@/lib/server/api";
import { toCustomer, toOrder } from "@/lib/server/mappers";
import type { ShippingAddress } from "@/types/shop";

export const dynamic = "force-dynamic";

export const GET = handle(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u || u.role !== "CUSTOMER") throw new ApiError(404, "Customer not found");
  const orders = await prisma.order.findMany({ where: { userId: id }, include: { items: true }, orderBy: { createdAt: "desc" }, take: 100 });
  const place = orders[0] ? (orders[0].shippingAddress as unknown as ShippingAddress) : undefined;
  const spent = orders.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0);
  return ok({ customer: toCustomer(u, place), orders: orders.map(toOrder), orderCount: orders.length, spent });
});
