'use client';

export default function ErrorBoundary({
  error,
  reset,
  heading,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  heading?: string;
}) {
  return (
    <>
      {heading && <h1 style={{ fontFamily: 'var(--display)', fontSize: 28 }}>{heading}</h1>}
      <p style={{ marginTop: heading ? 12 : 0, color: 'var(--sage)' }}>{error.message}</p>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </>
  );
}
