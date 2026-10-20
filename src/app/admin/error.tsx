"use client";

import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="a-card mx-auto my-16 max-w-md p-8 text-center">
      <p className="font-serif text-2xl">Something went wrong</p>
      <p className="mt-1 text-sm text-muted">This page hit an error. Your data is safe — try again.</p>
      {error.digest && <code className="mt-3 inline-block rounded bg-cream px-2 py-1 text-xs text-muted">Ref: {error.digest}</code>}
      <div className="mt-5"><button onClick={reset} className="a-btn-dark">Try again</button></div>
    </div>
  );
}
