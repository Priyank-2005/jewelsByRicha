import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ToastProvider } from "@/context/ToastContext";
import { AdminShell } from "@/components/admin/AdminShell";
import "../globals.css";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-cormorant" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Admin | Jewels by Richa", template: "%s | Admin · Jewels by Richa" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${inter.variable} bg-cream font-sans antialiased`}>
        <ToastProvider>
          <AdminShell>{children}</AdminShell>
        </ToastProvider>
      </body>
    </html>
  );
}
