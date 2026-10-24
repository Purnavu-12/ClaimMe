"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="standalone">
      <h1>This view couldn’t load.</h1>
      <p>
        Your saved demo data has not been intentionally changed. Try loading the
        view again.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
