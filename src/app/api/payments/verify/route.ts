import { z } from "zod";
import prisma from "@/lib/db";
import { ApiError, body, clientIp, handle, ok, rateLimit } from "@/lib/server/api";
import { markOrderPaid } from "@/lib/server/orders";
import { getRazorpay, razorpayConfigured, verifyPaymentSignature } from "@/lib/server/razorpay";
import { getCustomer } from "@/lib/server/session";
import { validOrderToken } from "@/lib/server/tokens";

const schema = z.object({
  orderNumber: z.string().min(3).max(30),
  token: z.string().max(100).optional(),
  razorpayOrderId: z.string().max(80).optional(),
  razorpayPaymentId: z.string().max(80).optional(),
  razorpaySignature: z.string().max(200).optional(),
});

/** Confirms a payment. The result is never taken from the browser alone: signature AND Razorpay's own API must agree. */
export const POST = handle(async (req: Request) => {
  const input = await body(req, schema);
  await rateLimit(`verify:${clientIp(req)}`, 30, 10 * 60);

  const order = await prisma.order.findUnique({ where: { number: input.orderNumber } });
  const me = await getCustomer();
  if (!order || !((me && order.userId === me.id) || validOrderToken(order.number, order.email, input.token))) throw new ApiError(404, "Order not found");
  if (order.paymentStatus === "PAID") return ok({ ok: true });
  if (order.status === "CANCELLED") throw new ApiError(400, "This order was cancelled.");

  if (!razorpayConfigured()) {
    if (process.env.NODE_ENV === "production") throw new ApiError(503, "Online payments are not available right now.");
    await markOrderPaid(order.id, { providerPaymentId: `mock_${Date.now()}`, method: order.paymentMethod });
    return ok({ ok: true, mock: true });
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) throw new ApiError(400, "Missing payment details");
  if (!verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) throw new ApiError(400, "Payment verification failed");

  // the Razorpay order must be the one we created for THIS order, for the right amount
  const pay = await prisma.payment.findUnique({ where: { providerOrderId: razorpayOrderId } });
  if (!pay || pay.orderId !== order.id) throw new ApiError(400, "Payment does not match this order");
  const rp = await getRazorpay().payments.fetch(razorpayPaymentId);
  if (rp.order_id !== razorpayOrderId || Number(rp.amount) !== order.total * 100 || !["captured", "authorized"].includes(String(rp.status))) {
    throw new ApiError(400, "Payment could not be confirmed");
  }
  await markOrderPaid(order.id, { providerOrderId: razorpayOrderId, providerPaymentId: razorpayPaymentId, method: String(rp.method ?? "") });
  return ok({ ok: true });
});
