import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  CONFIRMED: "bg-sky-50 text-sky-800 border-sky-200",
  SHIPPED: "bg-indigo-50 text-indigo-800 border-indigo-200",
  DELIVERED: "bg-emerald-50 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-800 border-rose-200",
  PAID: "bg-emerald-50 text-emerald-800 border-emerald-200",
  REFUNDED: "bg-rose-50 text-rose-800 border-rose-200",
  ACTIVE: "bg-emerald-50 text-emerald-800 border-emerald-200",
  DRAFT: "bg-stone-100 text-stone-700 border-stone-200",
  INACTIVE: "bg-stone-100 text-stone-700 border-stone-200",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize", STYLES[status] ?? STYLES.DRAFT, className)}>
      {status.toLowerCase()}
    </span>
  );
}
