'use client';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="admin-wrap" style={{ paddingTop: 96 }}>
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
