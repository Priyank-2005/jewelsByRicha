import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-serif text-6xl">Page not found</h1>
      <p className="text-muted">The page you&apos;re looking for has wandered off.</p>
      <Link href="/" className="btn-dark mt-2">Back to home</Link>
    </div>
  );
}
