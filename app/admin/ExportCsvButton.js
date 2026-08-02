'use client';

export default function ExportCsvButton({ rows }) {
  function handleExport() {
    const header = ['Guest', 'Attending', 'Party size', 'Email', 'Submitted'];
    const lines = rows.map((r) => [
      r.guestName,
      r.attending ? 'Yes' : 'No',
      r.partySize,
      r.email || '',
      new Date(r.createdAt).toLocaleString(),
    ]);

    const csv = [header, ...lines]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvps.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" className="csv-btn" onClick={handleExport}>
      Export CSV
    </button>
  );
}
