'use client';

import { useState } from 'react';
import { useGuestMutations } from './hooks/useGuestMutations';
import { FormStatus } from '@/lib/types';
import type { Guest } from '@/lib/types';

export default function EditGuestForm({
  guest,
  onDone,
}: {
  guest: Guest;
  onDone: () => void;
}) {
  const [name, setName] = useState(guest.display_name);
  const [partySize, setPartySize] = useState(guest.party_size);
  const [whatsapp, setWhatsapp] = useState(guest.whatsapp ?? '');
  const { savingId, error, updateGuest } = useGuestMutations();
  const status: FormStatus =
    savingId === guest.id
      ? FormStatus.Submitting
      : error
        ? FormStatus.Error
        : FormStatus.Idle;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await updateGuest(guest.id, {
      display_name: name,
      party_size: Number(partySize),
      whatsapp,
    });
    if (result.ok) {
      onDone();
    }
  }

  return (
    <tr className="admin-edit-row">
      <td colSpan={7}>
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
              onChange={(e) => setPartySize(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
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
              placeholder="+57 \u2026"
            />
          </div>
          <button
            className="submit-btn"
            type="submit"
            disabled={status === FormStatus.Submitting}
          >
            {status === FormStatus.Submitting ? 'Saving\u2026' : 'Save'}
          </button>
          <button className="csv-btn" type="button" onClick={onDone}>
            Cancel
          </button>
          {status === FormStatus.Error && (
            <p className="form-error">Couldn&apos;t save changes.</p>
          )}
        </form>
      </td>
    </tr>
  );
}
