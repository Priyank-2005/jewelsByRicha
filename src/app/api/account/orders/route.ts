import prisma from "@/lib/db";
import { handle, ok, requireCustomer } from "@/lib/server/api";
import { toOrder } from "@/lib/server/mappers";
import { pageMeta, paging } from "@/lib/server/paging";

export const dynamic = "force-dynamic";

export const GET = handle(async (req: Request) => {
  const me = await requireCustomer();
  const { page, pageSize, skip, take } = paging(req, 10, 50);
  const where = { OR: [{ userId: me.id }, { email: me.email }] };
  const [total, orders, spent] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({ where, include: { items: true }, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.order.aggregate({ where: { ...where, status: { not: "CANCELLED" } }, _sum: { total: true } }),
  ]);
  return ok({ orders: orders.map(toOrder), spent: spent._sum.total ?? 0, ...pageMeta(page, pageSize, total) });
});
