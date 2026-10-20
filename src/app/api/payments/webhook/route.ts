import prisma from "@/lib/db";
import { markOrderPaid } from "@/lib/server/orders";
import { verifyWebhookSignature } from "@/lib/server/razorpay";

/** Razorpay -> us. Authoritative source of payment status (covers customers who close the tab after paying). */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, signature)) return Response.json({ error: "Invalid signature" }, { status: 400 });

  const eventId = req.headers.get("x-razorpay-event-id");
  try {
    if (eventId) {
      const seen = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
      if (seen) return Response.json({ ok: true, duplicate: true });
    }
    const event = JSON.parse(raw) as { event: string; payload?: { payment?: { entity?: { id: string; order_id: string; amount: number; method?: string } } } };
    const entity = event.payload?.payment?.entity;

    if (entity && (event.event === "payment.captured" || event.event === "order.paid")) {
      const pay = await prisma.payment.findUnique({ where: { providerOrderId: entity.order_id }, include: { order: true } });
      if (pay && pay.order.total * 100 === Number(entity.amount)) {
        await markOrderPaid(pay.orderId, { providerOrderId: entity.order_id, providerPaymentId: entity.id, method: entity.method });
      }
    } else if (entity && event.event === "payment.failed") {
      await prisma.payment.updateMany({ where: { providerOrderId: entity.order_id, status: "PENDING" }, data: { status: "FAILED" } });
    }
    if (eventId) await prisma.webhookEvent.create({ data: { id: eventId, type: event.event } }).catch(() => {});
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[webhook]", e);
    return Response.json({ error: "Processing failed" }, { status: 500 }); // Razorpay retries
  }
}
