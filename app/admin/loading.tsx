import Spinner from '@/app/components/shared/Spinner';

export default function AdminLoading() {
  return (
    <main className="admin-wrap" style={{ paddingTop: 96 }}>
      <Spinner />
    </main>
  );
}
