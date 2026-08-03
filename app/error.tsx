'use client';

import ErrorBoundary from '@/app/components/shared/ErrorBoundary';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{ padding: '96px 24px', textAlign: 'center' }}>
      <ErrorBoundary error={error} reset={reset} heading="Something went wrong" />
    </main>
  );
}
