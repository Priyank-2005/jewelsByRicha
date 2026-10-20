import prisma from "@/lib/db";
import { handle, ok, requireCustomer } from "@/lib/server/api";
import { toOrder } from "@/lib/server/mappers";

export const GET = handle(async () => {
  const me = await requireCustomer();
  const orders = await prisma.order.findMany({ where: { OR: [{ userId: me.id }, { email: me.email }] }, include: { items: true }, orderBy: { createdAt: "desc" }, take: 200 });
  return ok({ orders: orders.map(toOrder) });
});
