import type { Metadata } from "next";
import { PolicyLayout } from "@/components/ui/PolicyLayout";

export const metadata: Metadata = { title: "Terms & conditions" };

export default function TermsPage() {
  return (
    <PolicyLayout eyebrow="Legal" title="Terms & conditions" intro="Placeholder — final legal copy to be provided by the client.">
      <section><h2>Using this site</h2><p>By placing an order you agree to provide accurate information and to the policies published on this website.</p></section>
      <section><h2>Pricing &amp; availability</h2><p>Prices are in INR and inclusive of taxes. Stock is limited and orders are confirmed on payment or COD verification.</p></section>
      <section><h2>Product images</h2><p>Colours may vary slightly between screens and the actual product.</p></section>
    </PolicyLayout>
  );
}
