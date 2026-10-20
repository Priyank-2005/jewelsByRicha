"use client";

/** Last-resort error page (used only if a root layout itself fails). Self-contained: no app styles or providers. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Georgia, serif", background: "#fbf8f1", color: "#121110", display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", textAlign: "center", margin: 0 }}>
        <div style={{ padding: 24 }}>
          <h1 style={{ fontWeight: 400, fontSize: 32 }}>Jewels by Richa</h1>
          <p style={{ fontFamily: "Arial, sans-serif", color: "#7a7266" }}>Something went wrong. Please try again in a moment.</p>
          <button onClick={reset} style={{ marginTop: 12, padding: "12px 28px", background: "#121110", color: "#fbf8f1", border: 0, letterSpacing: 2, cursor: "pointer" }}>TRY AGAIN</button>
        </div>
      </body>
    </html>
  );
}
