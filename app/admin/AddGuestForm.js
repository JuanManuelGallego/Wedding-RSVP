'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddGuestForm() {
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [status, setStatus] = useState('idle'); // idle | submitting | error
  const [link, setLink] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setLink('');

    const res = await fetch('/api/admin/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: name, party_size: partySize }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus('error');
      return;
    }

    setStatus('idle');
    setName('');
    setPartySize(1);
    setLink(`${window.location.origin}/rsvp/${body.guest.slug}`);
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
          <select id="partySize" value={partySize} onChange={(e) => setPartySize(e.target.value)}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <button className="submit-btn" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Creating…' : 'Create link'}
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
