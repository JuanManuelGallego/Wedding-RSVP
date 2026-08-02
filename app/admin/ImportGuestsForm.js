'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportGuestsForm() {
  const [status, setStatus] = useState('idle'); // idle | uploading | error
  const [result, setResult] = useState(null);
  const fileInput = useRef(null);
  const router = useRouter();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setResult(null);

    const text = await file.text();

    const res = await fetch('/api/admin/guests/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv: text }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus('error');
      setResult(body);
      if (fileInput.current) fileInput.current.value = '';
      return;
    }

    setStatus('idle');
    setResult(body);
    if (fileInput.current) fileInput.current.value = '';
    router.refresh();
  }

  return (
    <div className="import-guests">
      <label className="import-label" htmlFor="csvFile">
        Upload CSV (columns: <code>name, party_size</code>)
      </label>
      <input
        id="csvFile"
        ref={fileInput}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFile}
        disabled={status === 'uploading'}
      />
      {status === 'uploading' && <p className="form-note">Importing…</p>}
      {result && !result.error && (
        <p className="form-note">
          Added {result.created} guest{result.created === 1 ? '' : 's'}.
          {result.skipped?.length > 0 && ` Skipped ${result.skipped.length} row(s) — check formatting.`}
        </p>
      )}
      {result?.error && <p className="form-error">{result.error}</p>}
    </div>
  );
}
