import prisma from "@/lib/db";
import { ApiError, handle, ok } from "@/lib/server/api";
import { toOrder } from "@/lib/server/mappers";
import { getCustomer } from "@/lib/server/session";
import { validOrderToken } from "@/lib/server/tokens";

/** Order status for the person who placed it: the signed-in owner, or a guest holding the order token. */
export const GET = handle(async (req: Request, ctx: { params: Promise<{ number: string }> }) => {
  const { number } = await ctx.params;
  const token = new URL(req.url).searchParams.get("token");
  const o = await prisma.order.findUnique({ where: { number }, include: { items: true } });
  const me = await getCustomer();
  if (!o || !((me && (o.userId === me.id || o.email === me.email)) || validOrderToken(o.number, o.email, token))) throw new ApiError(404, "Order not found");
  return ok({ order: toOrder(o) });
});
