"use client";

import { Clock, Mail, Phone } from "lucide-react";
import { Instagram } from "@/components/ui/InstagramIcon";
import { PolicyLayout } from "@/components/ui/PolicyLayout";
import { useToast } from "@/context/ToastContext";
import { BRAND } from "@/config/brand";

export default function ContactPage() {
  const { showToast } = useToast();
  return (
    <PolicyLayout eyebrow="We'd love to hear from you" title="Contact us" intro="Questions about an order or a piece? Drop us a line.">
      <div className="!mt-0 grid gap-10 md:grid-cols-2">
        <ul className="space-y-5 [&_li]:ml-0 [&_li]:list-none">
          <li className="flex gap-3"><Mail className="h-5 w-5 text-gold" /> {BRAND.contact.email}</li>
          <li className="flex gap-3"><Phone className="h-5 w-5 text-gold" /> {BRAND.contact.phone}</li>
          <li className="flex gap-3"><Instagram className="h-5 w-5 text-gold" /> @{BRAND.social.instagram}</li>
          <li className="flex gap-3"><Clock className="h-5 w-5 text-gold" /> {BRAND.businessHours}</li>
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast("Message sent — we'll reply soon");
            (e.target as HTMLFormElement).reset();
          }}
          className="space-y-4"
        >
          <input required placeholder="Your name" className="input" />
          <input required type="email" placeholder="Email" className="input" />
          <textarea required rows={5} placeholder="How can we help?" className="input" />
          <button className="btn-dark">Send message</button>
        </form>
      </div>
    </PolicyLayout>
  );
}
