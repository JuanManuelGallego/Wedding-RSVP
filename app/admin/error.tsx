'use client';

import ErrorBoundary from '@/app/components/shared/ErrorBoundary';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="admin-wrap" style={{ paddingTop: 96 }}>
      <ErrorBoundary error={error} reset={reset} heading="Something went wrong" />
    </main>
  );
}
