import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpayConfigured = () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

let instance: Razorpay | null = null;
export function getRazorpay() {
  if (!instance) {
    if (!razorpayConfigured()) throw new Error("Razorpay is not configured");
    instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
  }
  return instance;
}

function safeHexEqual(a: string, b: string) {
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

/** Signature the browser returns after paying: HMAC(order_id|payment_id) with the key secret. */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeHexEqual(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  return safeHexEqual(crypto.createHmac("sha256", secret).update(rawBody).digest("hex"), signature);
}
