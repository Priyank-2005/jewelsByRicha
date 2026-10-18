import type { Metadata } from "next";
import { PolicyLayout } from "@/components/ui/PolicyLayout";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = { title: "Shipping & returns" };

export default function ShippingReturns() {
  return (
    <PolicyLayout eyebrow="Policies" title="Shipping & returns" intro="Placeholder policy copy — final wording to be provided by the client.">
      <section>
        <h2>Shipping</h2>
        <ul>
          <li>Free shipping on orders above ₹{BRAND.freeShippingThreshold}; ₹{BRAND.shippingFee} flat rate below.</li>
          <li>Orders are dispatched within 1–2 business days.</li>
          <li>Delivery within 3–7 business days across India.</li>
          <li>Cash on delivery has a ₹{BRAND.codFee} handling fee.</li>
        </ul>
      </section>
      <section>
        <h2>Returns &amp; refunds</h2>
        <ul>
          <li>7-day returns on unused pieces in original packaging.</li>
          <li>Please share an unboxing video for damaged or incorrect items.</li>
          <li>Refunds are issued to the original payment method within 5–7 business days.</li>
        </ul>
      </section>
    </PolicyLayout>
  );
}
