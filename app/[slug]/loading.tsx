import Spinner from '@/app/components/shared/Spinner';

export default function Loading() {
  return (
    <main style={{ padding: '96px 24px', textAlign: 'center' }}>
      <Spinner />
    </main>
  );
}
