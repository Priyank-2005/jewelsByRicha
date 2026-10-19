import Link from "next/link";

export function SectionHead({ eyebrow, title, action, align = "center", dark = false }: { eyebrow: string; title: React.ReactNode; action?: { label: string; href: string }; align?: "center" | "left"; dark?: boolean }) {
  return (
    <div className={`mb-12 flex flex-col gap-3 md:mb-16 ${align === "center" ? "items-center text-center justify-center" : "items-start md:flex-row md:items-end md:justify-between"}`}>
      <div className={align === "center" ? "flex flex-col items-center text-center mx-auto" : ""}>
        <p className={`eyebrow flex items-center justify-center gap-3 sm:gap-4 ${dark ? "!text-gold-light" : ""}`}>
          <span className={`h-px w-6 sm:w-10 ${dark ? "bg-gold-light/40" : "bg-gold/40"}`} />
          <span>{eyebrow}</span>
          <span className={`h-px w-6 sm:w-10 ${dark ? "bg-gold-light/40" : "bg-gold/40"}`} />
        </p>
        <h2 className={`mt-3.5 font-serif text-[2.2rem] font-extralight leading-tight tracking-[-0.01em] md:text-[3.2rem] ${dark ? "text-ivory" : "text-ink"}`}>{title}</h2>
      </div>
      {action && (
        <Link href={action.href} className={`group inline-flex items-center gap-2 border-b pb-1 text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors duration-300 ${dark ? "border-ivory/30 text-ivory/80 hover:border-gold-light hover:text-gold-light" : "border-ink/60 text-ink/80 hover:border-gold hover:text-gold-deep"}`}>
          {action.label} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}
