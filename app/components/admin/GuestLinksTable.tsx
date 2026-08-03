'use client';

import { useState } from 'react';
import EditGuestForm from './EditGuestForm';
import { useGuestMutations } from './hooks/useGuestMutations';
import type { Guest } from '../../../lib/types';

export default function GuestLinksTable({
  guests,
  origin,
}: {
  guests: Guest[];
  origin: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { savingId, error, updateGuest } = useGuestMutations();

  function toggleSent(g: Guest) {
    updateGuest(g.id, { invite_sent: !g.invite_sent });
  }

  function setLang(g: Guest, lang: string) {
    updateGuest(g.id, { lang });
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Party size</th>
            <th>WhatsApp</th>
            <th>Sent</th>
            <th>Lang</th>
            <th>Link</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) =>
            editingId === g.id ? (
              <EditGuestForm key={g.id} guest={g} onDone={() => setEditingId(null)} />
            ) : (
              <tr key={g.id}>
                <td>{g.display_name}</td>
                <td>{g.party_size}</td>
                <td>{g.whatsapp ?? '\u2014'}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={g.invite_sent}
                    disabled={savingId === g.id}
                    onChange={() => toggleSent(g)}
                    aria-label={`Invitation sent to ${g.display_name}`}
                  />
                </td>
                <td>
                  <select
                    className="admin-lang-select"
                    value={g.lang ?? 'es'}
                    disabled={savingId === g.id}
                    onChange={(e) => setLang(g, e.target.value)}
                    aria-label={`Invitation language for ${g.display_name}`}
                  >
                    <option value="es">ES</option>
                    <option value="fr">FR</option>
                  </select>
                </td>
                <td>
                  <a href={`/${g.slug}${g.lang === 'fr' ? '?lang=fr' : ''}`}>
                    {`${origin}/${g.slug}${g.lang === 'fr' ? '?lang=fr' : ''}`}
                  </a>
                </td>
                <td>
                  <button
                    className="csv-btn"
                    type="button"
                    onClick={() => setEditingId(g.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            )
          )}
          {guests.length === 0 && (
            <tr>
              <td colSpan={7}>No guests added yet.</td>
            </tr>
          )}
        </tbody>
      </table>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
