import prisma from "@/lib/db";
import { ApiError, handle, ok, requireCustomer } from "@/lib/server/api";
import { cancelOrder } from "@/lib/server/orders";

/** Customers can cancel their own order until it is confirmed (or, for Cash on Delivery, until it ships). */
export const POST = handle(async (_req: Request, ctx: { params: Promise<{ number: string }> }) => {
  const me = await requireCustomer();
  const { number } = await ctx.params;
  const o = await prisma.order.findUnique({ where: { number } });
  if (!o || (o.userId !== me.id && o.email !== me.email)) throw new ApiError(404, "Order not found");
  const allowed = o.status === "PENDING" || (o.status === "CONFIRMED" && o.paymentMethod === "COD");
  if (!allowed) throw new ApiError(400, "This order can no longer be cancelled online. Please contact us and we'll help.");
  return ok({ order: await cancelOrder(number) });
});
