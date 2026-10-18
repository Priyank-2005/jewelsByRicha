import type { Metadata } from "next";
import { PolicyLayout } from "@/components/ui/PolicyLayout";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <PolicyLayout eyebrow="Legal" title="Privacy policy" intro="Placeholder — final legal copy to be provided by the client.">
      <section><h2>Information we collect</h2><p>Name, contact details, delivery address and order history, collected to fulfil your orders and support you.</p></section>
      <section><h2>How we use it</h2><p>To process orders, arrange delivery, send order updates and, with your consent, share new launches and offers.</p></section>
      <section><h2>Your choices</h2><p>You can update or request deletion of your data at any time by contacting us.</p></section>
    </PolicyLayout>
  );
}
