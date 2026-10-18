import type { Metadata } from "next";
import { PolicyLayout } from "@/components/ui/PolicyLayout";

export const metadata: Metadata = { title: "Jewellery care" };

export default function CarePage() {
  return (
    <PolicyLayout eyebrow="Keep it shining" title="Jewellery care" intro="A little care keeps every piece looking as good as day one.">
      <section>
        <h2>Anti Tarnish range</h2>
        <ul>
          <li>Waterproof — safe in the shower, pool and gym.</li>
          <li>Pat dry with a soft cloth after water or sweat exposure.</li>
          <li>Avoid direct contact with perfume, bleach and harsh chemicals.</li>
          <li>Store in the pouch provided when not in use.</li>
        </ul>
      </section>
      <section>
        <h2>Festive Collection</h2>
        <ul>
          <li>Put jewellery on last — after makeup, perfume and hairspray.</li>
          <li>Remove before bathing, swimming or exercising.</li>
          <li>Wipe gently with a soft dry cloth after wearing.</li>
          <li>Store each piece separately in the box provided, away from moisture.</li>
        </ul>
      </section>
    </PolicyLayout>
  );
}
