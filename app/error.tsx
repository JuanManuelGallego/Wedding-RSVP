'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{ padding: '96px 24px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--display)', fontSize: 28 }}>Something went wrong</h1>
      <p style={{ marginTop: 12, color: 'var(--sage)' }}>{error.message}</p>
      <button
        onClick={reset}
        style={{
          marginTop: 24,
          padding: '12px 24px',
          background: 'var(--gold)',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontFamily: 'var(--body)',
        }}
      >
        Try again
      </button>
    </main>
  );
}
