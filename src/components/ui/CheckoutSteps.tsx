import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Bag", "Details & payment", "Confirmation"];

export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol className="mx-auto mb-8 flex max-w-xl items-center justify-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.16em] sm:gap-4 sm:text-xs md:mb-12">
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center gap-2 sm:gap-4">
          <span className={cn("flex items-center gap-2", i <= current ? "text-ink" : "text-muted")}>
            <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border text-[11px]", i < current ? "border-gold bg-gold text-ink" : i === current ? "border-ink bg-ink text-ivory" : "border-line")}>
              {i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={cn(i === current ? "" : "hidden sm:inline")}>{s}</span>
          </span>
          {i < STEPS.length - 1 && <span className="h-px w-5 bg-line sm:w-10" />}
        </li>
      ))}
    </ol>
  );
}
