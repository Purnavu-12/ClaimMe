import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="standalone">
      <p className="eyebrow">Page not found</p>
      <h1>Let’s find a clearer path.</h1>
      <p>This page or claim isn’t part of the demo.</p>
      <Link className="button" href="/app/claims">
        Go to claims
      </Link>
    </main>
  );
}
