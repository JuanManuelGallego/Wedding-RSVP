'use client';

interface CsvRow {
  guestName: string;
  attending: boolean | null;
  partySize: number;
  whatsapp: string;
  respondedAt: string | null;
}

export default function ExportCsvButton({ rows }: { rows: CsvRow[] }) {
  function handleExport() {
    const header = ['Guest', 'Attending', 'Party size', 'WhatsApp', 'Responded'];
    const lines = rows.map((r) => [
      r.guestName,
      r.attending ? 'Yes' : 'No',
      r.partySize,
      r.whatsapp ?? '',
      new Date(r.respondedAt!).toLocaleString(),
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
