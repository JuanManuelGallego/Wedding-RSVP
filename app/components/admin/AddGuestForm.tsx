'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormStatus } from '@/lib/types';

const CSRF_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' };

export default function AddGuestForm() {
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState<FormStatus>(FormStatus.Idle);
  const [link, setLink] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(FormStatus.Submitting);
    setLink('');

    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...CSRF_HEADERS },
        body: JSON.stringify({
          display_name: name,
          party_size: partySize,
          whatsapp,
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(FormStatus.Error);
        return;
      }

      setStatus(FormStatus.Idle);
      setName('');
      setPartySize(1);
      setWhatsapp('');
      setLink(`${window.location.origin}/${body.guest.slug}`);
      router.refresh();
    } catch {
      setStatus(FormStatus.Error);
    }
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
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
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
            placeholder="+57 300 123 4567"
          />
        </div>
        <button className="submit-btn" type="submit" disabled={status === FormStatus.Submitting}>
          {status === FormStatus.Submitting ? 'Creating\u2026' : 'Create link'}
        </button>
      </form>
      {status === FormStatus.Error && (
        <p className="form-error">Couldn&apos;t create that guest.</p>
      )}
      {link && (
        <p className="admin-new-link">
          Link created: <a href={link}>{link}</a>
        </p>
      )}
    </div>
  );
}
