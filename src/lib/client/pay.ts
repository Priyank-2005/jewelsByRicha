import { api } from "./api";

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (ev: string, cb: () => void) => void };
  }
}

interface PayInit {
  mode: "mock" | "razorpay";
  keyId?: string;
  razorpayOrderId?: string;
  amount: number;
  name?: string;
  email?: string;
  phone?: string;
}

/** Opens the payment window for an existing unpaid online order. Resolves true when paid, false when dismissed. */
export async function payForOrder(orderNumber: string, token?: string): Promise<boolean> {
  const pay = await api<PayInit>("/api/payments/create-order", { method: "POST", body: { orderNumber, token } });
  if (pay.mode === "mock") {
    await api("/api/payments/verify", { method: "POST", body: { orderNumber, token } });
    return true;
  }
  if (!window.Razorpay) throw new Error("The payment window could not load. Please refresh and try again.");
  return new Promise<boolean>((resolve, reject) => {
    const rz = new window.Razorpay!({
      key: pay.keyId,
      order_id: pay.razorpayOrderId,
      amount: pay.amount,
      currency: "INR",
      name: "Jewels by Richa",
      description: `Order ${orderNumber}`,
      prefill: { name: pay.name, email: pay.email, contact: pay.phone },
      theme: { color: "#B8913A" },
      handler: async (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        try {
          await api("/api/payments/verify", { method: "POST", body: { orderNumber, token, razorpayOrderId: r.razorpay_order_id, razorpayPaymentId: r.razorpay_payment_id, razorpaySignature: r.razorpay_signature } });
          resolve(true);
        } catch (e) {
          reject(e);
        }
      },
      modal: { ondismiss: () => resolve(false) },
    });
    rz.on("payment.failed", () => resolve(false));
    rz.open();
  });
}
