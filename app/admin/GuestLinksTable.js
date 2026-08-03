'use client';

import { useState } from 'react';
import EditGuestForm from './EditGuestForm';

export default function GuestLinksTable({ guests, origin }) {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Party size</th>
            <th>WhatsApp</th>
            <th>Link</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(guests || []).map((g) =>
            editingId === g.id ? (
              <EditGuestForm key={g.id} guest={g} onDone={() => setEditingId(null)} />
            ) : (
              <tr key={g.id}>
                <td>{g.display_name}</td>
                <td>{g.party_size}</td>
                <td>{g.whatsapp || '—'}</td>
                <td>
                  <a href={`/${g.slug}`}>{`${origin}/${g.slug}`}</a>
                </td>
                <td>
                  <button className="csv-btn" type="button" onClick={() => setEditingId(g.id)}>
                    Edit
                  </button>
                </td>
              </tr>
            )
          )}
          {(!guests || guests.length === 0) && (
            <tr>
              <td colSpan={5}>No guests added yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
