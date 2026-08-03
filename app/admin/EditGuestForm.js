'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditGuestForm({ guest, onDone }) {
  const [name, setName] = useState(guest.display_name);
  const [partySize, setPartySize] = useState(guest.party_size);
  const [whatsapp, setWhatsapp] = useState(guest.whatsapp || '');
  const [status, setStatus] = useState('idle'); // idle | submitting | error
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');

    const res = await fetch(`/api/admin/guests/${guest.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: name,
        party_size: Number(partySize),
        whatsapp,
      }),
    });

    if (!res.ok) {
      setStatus('error');
      return;
    }

    setStatus('idle');
    onDone();
    router.refresh();
  }

  return (
    <tr className="admin-edit-row">
      <td colSpan={5}>
        <form className="form form--inline admin-edit-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor={`editName-${guest.id}`}>Name</label>
            <input
              id={`editName-${guest.id}`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor={`editParty-${guest.id}`}>Party size</label>
            <select
              id={`editParty-${guest.id}`}
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor={`editWhatsapp-${guest.id}`}>WhatsApp number</label>
            <input
              id={`editWhatsapp-${guest.id}`}
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+57 …"
            />
          </div>
          <button className="submit-btn" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Saving…' : 'Save'}
          </button>
          <button className="csv-btn" type="button" onClick={onDone}>
            Cancel
          </button>
          {status === 'error' && <p className="form-error">Couldn&apos;t save changes.</p>}
        </form>
      </td>
    </tr>
  );
}
