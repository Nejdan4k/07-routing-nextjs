export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      style={{
        minHeight: '40vh',
        display: 'grid',
        placeItems: 'center',
        fontSize: 16,
        color: '#495057',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 18,
            height: 18,
            border: '2px solid #dee2e6',
            borderTopColor: '#4d5ae5',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span>Loading…</span>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}