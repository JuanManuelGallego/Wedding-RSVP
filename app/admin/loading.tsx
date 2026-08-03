export default function AdminLoading() {
  return (
    <main className="admin-wrap" style={{ paddingTop: 96 }}>
      <div
        style={{
          width: 32,
          height: 32,
          border: '3px solid var(--line)',
          borderTopColor: 'var(--gold)',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
