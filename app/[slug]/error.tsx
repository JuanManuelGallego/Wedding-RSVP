'use client';

export default function GuestInviteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <section className="hero" style={{ borderTop: 'none' }}>
        <div className="wrap">
          <p className="eyebrow">Error</p>
          <p style={{ fontSize: 18 }}>{error.message}</p>
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
        </div>
      </section>
    </main>
  );
}
