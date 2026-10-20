import { body, clientIp, handle, ok, rateLimit } from "@/lib/server/api";
import { createOrder, createOrderSchema, expireUnpaidOrders } from "@/lib/server/orders";
import { getCustomer } from "@/lib/server/session";
import { orderToken } from "@/lib/server/tokens";

/**
 * Places an order. Prices, stock, coupon and totals are all computed on the server from the database;
 * the browser only sends product ids and quantities.
 */
export const POST = handle(async (req: Request) => {
  const input = await body(req, createOrderSchema);
  await rateLimit(`order:${clientIp(req)}`, 15, 10 * 60);
  void expireUnpaidOrders().catch(() => {});

  const me = await getCustomer();
  const email = me?.email ?? input.email;
  const order = await createOrder({ ...input, email }, me?.id ?? null);
  return ok({ order, token: orderToken(order.id, order.email) }, { status: 201 });
});
