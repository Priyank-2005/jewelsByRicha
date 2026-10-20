"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function StoreError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-28 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="font-serif text-4xl font-light md:text-5xl">We couldn&apos;t load this page</h1>
      <p className="text-muted">It&apos;s on our side, not yours. Please try again — if it keeps happening, contact us and quote the reference below.</p>
      {error.digest && <code className="rounded bg-cream px-2 py-1 text-xs text-muted">Ref: {error.digest}</code>}
      <div className="mt-2 flex gap-3">
        <button onClick={reset} className="btn-dark">Try again</button>
        <Link href="/" className="btn-outline">Go home</Link>
      </div>
    </div>
  );
}
