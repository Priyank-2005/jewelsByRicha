import Link from "next/link";

export function SectionHead({ eyebrow, title, action, align = "center" }: { eyebrow: string; title: React.ReactNode; action?: { label: string; href: string }; align?: "center" | "left" }) {
  return (
    <div className={`mb-10 flex flex-col gap-3 md:mb-14 ${align === "center" ? "items-center text-center" : "items-start md:flex-row md:items-end md:justify-between"}`}>
      <div className={align === "center" ? "flex flex-col items-center" : ""}>
        <p className="eyebrow flex items-center gap-3">
          <span className="hidden h-px w-8 bg-gold/60 sm:block" />
          {eyebrow}
          <span className="hidden h-px w-8 bg-gold/60 sm:block" />
        </p>
        <h2 className="mt-3 font-serif text-4xl font-light leading-tight md:text-[3.4rem]">{title}</h2>
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-medium uppercase tracking-[0.22em] hover:border-gold hover:text-gold-deep">
          {action.label} <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}
