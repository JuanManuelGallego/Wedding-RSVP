'use client';

import ErrorBoundary from '@/app/components/shared/ErrorBoundary';

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
          <ErrorBoundary error={error} reset={reset} />
        </div>
      </section>
    </main>
  );
}
