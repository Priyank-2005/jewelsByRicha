import prisma from "@/lib/db";
import { ApiError, body, clientIp, handle, ok, rateLimit, requireAdmin } from "@/lib/server/api";
import { orderPatchSchema } from "@/lib/server/admin-schemas";
import { toOrder } from "@/lib/server/mappers";
import { adminUpdateOrder } from "@/lib/server/orders";

export const dynamic = "force-dynamic";

export const GET = handle(async (_req: Request, ctx: { params: Promise<{ number: string }> }) => {
  await requireAdmin();
  const { number } = await ctx.params;
  const o = await prisma.order.findUnique({ where: { number }, include: { items: true } });
  if (!o) throw new ApiError(404, "Order not found");
  return ok({ order: toOrder(o) });
});

export const PUT = handle(async (req: Request, ctx: { params: Promise<{ number: string }> }) => {
  await requireAdmin();
  await rateLimit(`admin-write:${clientIp(req)}`, 120, 60);
  const { number } = await ctx.params;
  const patch = await body(req, orderPatchSchema);
  return ok({ order: await adminUpdateOrder(number, patch) });
});
