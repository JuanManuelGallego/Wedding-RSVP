'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FormStatus } from '@/lib/types';

const CSRF_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' };

interface ImportResult {
  created?: number;
  skipped?: Array<{ row: string[]; reason: string }>;
  error?: string;
}

export default function ImportGuestsForm() {
  const [status, setStatus] = useState<FormStatus>(FormStatus.Idle);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus(FormStatus.Uploading);
    setResult(null);

    try {
      const text = await file.text();

      const res = await fetch('/api/admin/guests/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...CSRF_HEADERS },
        body: JSON.stringify({ csv: text }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(FormStatus.Error);
        setResult(body);
        if (fileInput.current) fileInput.current.value = '';
        return;
      }

      setStatus(FormStatus.Idle);
      setResult(body);
      if (fileInput.current) fileInput.current.value = '';
      router.refresh();
    } catch {
      setStatus(FormStatus.Error);
      setResult({ error: 'Network error. Please try again.' });
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  return (
    <div className="import-guests">
      <label className="import-label" htmlFor="csvFile">
        Upload CSV (columns: <code>name, party_size, whatsapp</code>)
      </label>
      <input
        id="csvFile"
        ref={fileInput}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFile}
        disabled={status === FormStatus.Uploading}
      />
      {status === FormStatus.Uploading && <p className="form-note">Importing\u2026</p>}
      {result && !result.error && (
        <p className="form-note">
          Added {result.created} guest{result.created === 1 ? '' : 's'}.
          {result.skipped && result.skipped.length > 0 && ` Skipped ${result.skipped.length} row(s) \u2014 check formatting.`}
        </p>
      )}
      {result?.error && <p className="form-error">{result.error}</p>}
    </div>
  );
}
