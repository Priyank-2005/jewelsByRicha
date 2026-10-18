export function PolicyLayout({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-2 font-serif text-5xl">{title}</h1>
          {intro && <p className="mx-auto mt-3 max-w-xl text-ink-soft">{intro}</p>}
        </div>
      </section>
      <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-14 leading-relaxed text-ink-soft [&_h2]:mb-2 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </>
  );
}
