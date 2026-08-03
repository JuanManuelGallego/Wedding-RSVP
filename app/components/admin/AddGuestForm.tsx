'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'submitting' | 'error';

export default function AddGuestForm() {
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [link, setLink] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setLink('');

    const res = await fetch('/api/admin/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: name,
        party_size: partySize,
        whatsapp,
      }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus('error');
      return;
    }

    setStatus('idle');
    setName('');
    setPartySize(1);
    setWhatsapp('');
    setLink(`${window.location.origin}/${body.guest.slug}`);
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form form--inline">
        <div className="field">
          <label htmlFor="guestName">Guest or family name</label>
          <input
            id="guestName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="The Alvarez Family"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="partySize">Party size</label>
          <select
            id="partySize"
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="guestWhatsapp">WhatsApp number</label>
          <input
            id="guestWhatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+57 \u2026"
          />
        </div>
        <button className="submit-btn" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Creating\u2026' : 'Create link'}
        </button>
      </form>
      {status === 'error' && <p className="form-error">Couldn&apos;t create that guest.</p>}
      {link && (
        <p className="admin-new-link">
          Link created: <a href={link}>{link}</a>
        </p>
      )}
    </div>
  );
}
