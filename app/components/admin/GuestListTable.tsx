'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import EditGuestForm from './EditGuestForm';
import { useGuestMutations } from './hooks/useGuestMutations';
import type { Guest } from '@/lib/types';

type StatusFilter = 'all' | 'responded' | 'pending' | 'attending' | 'not_attending';
type SortKey =
  | 'display_name'
  | 'party_size'
  | 'invite_sent'
  | 'viewed_at'
  | 'attending'
  | 'responded_at'
  | 'lang';

const PER_PAGE = 10;

function matchesSearch(g: Guest, q: string) {
  if (!q) return true;
  return g.display_name.toLowerCase().includes(q.toLowerCase());
}

function matchesStatus(g: Guest, s: StatusFilter) {
  if (s === 'all') return true;
  if (s === 'responded') return g.attending !== null;
  if (s === 'pending') return g.attending === null;
  if (s === 'attending') return g.attending === true;
  if (s === 'not_attending') return g.attending === false;
  return true;
}

function compare(a: Guest, b: Guest, key: SortKey, dir: 'asc' | 'desc') {
  const mul = dir === 'asc' ? 1 : -1;

  const aVal = a[ key ];
  const bVal = b[ key ];

  if (aVal == null && bVal == null) return 0;
  if (aVal == null) return 1;
  if (bVal == null) return -1;

  if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
    return (aVal === bVal ? 0 : aVal ? -1 : 1) * mul;
  }

  if (typeof aVal === 'number' && typeof bVal === 'number') {
    return (aVal - bVal) * mul;
  }

  if (typeof aVal === 'string' && typeof bVal === 'string') {
    return aVal.localeCompare(bVal) * mul;
  }

  return 0;
}

export default function GuestListTable({
  guests,
  origin,
}: {
  guests: Guest[];
  origin: string;
}) {
  const [ search, setSearch ] = useState('');
  const [ statusFilter, setStatusFilter ] = useState<StatusFilter>('all');
  const [ sortKey, setSortKey ] = useState<SortKey>('display_name');
  const [ sortDir, setSortDir ] = useState<'asc' | 'desc'>('asc');
  const [ page, setPage ] = useState(1);
  const [ editingId, setEditingId ] = useState<string | null>(null);
  const [ copiedId, setCopiedId ] = useState<string | null>(null);
  const { savingId, error, updateGuest } = useGuestMutations();
  const router = useRouter();

  const filtered = useMemo(() => {
    return guests.filter(
      (g) => matchesSearch(g, search) && matchesStatus(g, statusFilter)
    );
  }, [ guests, search, statusFilter ]);

  const sorted = useMemo(() => {
    return [ ...filtered ].sort((a, b) => compare(a, b, sortKey, sortDir));
  }, [ filtered, sortKey, sortDir ]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const pageItems = sorted.slice(start, start + PER_PAGE);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }

  function handleSearch(q: string) {
    setSearch(q);
    setPage(1);
  }

  function handleFilter(s: StatusFilter) {
    setStatusFilter(s);
    setPage(1);
  }

  async function toggleSent(g: Guest) {
    await updateGuest(g.id, { invite_sent: !g.invite_sent });
  }

  async function setLang(g: Guest, lang: string) {
    await updateGuest(g.id, { lang });
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return null;
    return <span className="admin-sort-icon">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>;
  }

  async function copyInviteLink(g: Guest) {
    const url = `${origin}/${g.slug}${g.lang === 'fr' ? '?lang=fr' : ''}`;
    const isPlural = g.party_size > 1;
    const message =
      g.lang === 'fr'
        ? `💍 Nous nous marions!\n\nNous voulons partager avec vous l'un des jours les plus importants de nos vies et nous espérons de tout cœur que vous pourrez nous accompagner.\n\nGardez cette date en tête! Ce sera un jour rempli d'amour, de célébration et d'émotions. 🥂\n\nVeuillez confirmer votre présence via ce lien:\n${url}\n\nVotre confirmation est très importante pour nous. 🤍\n\nManu & Juanma`
        : isPlural
          ? `💍 ¡Nos casamos!\n\nQueremos compartir con ustedes uno de los días más importantes de nuestras vidas y esperamos de corazón que puedan acompañarnos.\n\n¡Agenda esta fecha! Será un día lleno de amor, celebración y muchas emociones. 🥂\n\nPor favor, confirmen su asistencia a través de este enlace:\n${url}\n\nSu confirmación es muy importante para nosotros. 🤍\n\nManu & Juanma`
          : `💍 ¡Nos casamos!\n\nQueremos compartir contigo uno de los días más importantes de nuestras vidas y esperamos de corazón que puedas acompañarnos.\n\n¡Agenda esta fecha! Será un día lleno de amor, celebración y muchas emociones. 🥂\n\nPor favor, confirma tu asistencia a través de este enlace:\n${url}\n\nTu confirmación es muy importante para nosotros. 🤍\n\nManu & Juanma`;
    try {
      await navigator.clipboard.writeText(message);
      setCopiedId(g.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  }

  function exportCsv() {
    const header = [ 'Name', 'Party Size', 'WhatsApp', 'Sent', 'Viewed', 'Lang', 'Attending', 'Responded', 'Link' ];
    const rows = sorted.map((g) => [
      g.display_name,
      String(g.party_size),
      g.whatsapp ?? '',
      g.invite_sent ? 'Yes' : 'No',
      g.viewed_at ? new Date(g.viewed_at).toLocaleString() : '',
      (g.lang ?? 'es').toUpperCase(),
      g.attending === null ? 'Pending' : g.attending ? 'Yes' : 'No',
      g.responded_at ? new Date(g.responded_at).toLocaleString() : '',
      `${origin}/${g.slug}${g.lang === 'fr' ? '?lang=fr' : ''}`,
    ]);

    const csv = [ header, ...rows ]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([ csv ], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guests.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function th(key: SortKey, label: string) {
    return (
      <th className="admin-sortable" onClick={() => handleSort(key)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleSort(key)}>
        {label}{sortIndicator(key)}
      </th>
    );
  }

  return (
    <div>
      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Search guests…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Search guests"
        />
        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(e) => handleFilter(e.target.value as StatusFilter)}
          aria-label="Filter by status"
        >
          <option value="all">All guests</option>
          <option value="responded">Responded</option>
          <option value="pending">Pending</option>
          <option value="attending">Attending</option>
          <option value="not_attending">Not attending</option>
        </select>
        <button type="button" className="csv-btn" onClick={exportCsv}>
          Export CSV
        </button>
        <button type="button" className="csv-btn" onClick={() => router.refresh()}>
          Refresh
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {th('display_name', 'Name')}
              {th('party_size', 'Party size')}
              <th>WhatsApp</th>
              {th('invite_sent', 'Sent')}
              {th('viewed_at', 'Viewed')}
              <th>Lang</th>
              {th('attending', 'Attending')}
              {th('responded_at', 'Responded')}
              <th>Link</th>
              <th>Copy</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((g) =>
              editingId === g.id ? (
                <EditGuestForm key={g.id} guest={g} onDone={() => setEditingId(null)} />
              ) : (
                <tr key={g.id}>
                  <td>{g.display_name}</td>
                  <td>{g.party_size}</td>
                  <td>
                    {g.whatsapp ? (
                      <a href={`https://wa.me/${g.whatsapp.replace(/[^0-9+]/g, '').replace(/^\+/, '')}`} target="_blank" rel="noopener noreferrer">
                        {g.whatsapp}
                      </a>
                    ) : '\u2014'}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={g.invite_sent}
                      disabled={savingId === g.id}
                      onChange={() => toggleSent(g)}
                      aria-label={`Invitation sent to ${g.display_name}`}
                    />
                  </td>
                  <td title={g.viewed_at ? new Date(g.viewed_at).toLocaleString() : 'Not yet'}>
                    {g.viewed_at ? '\u2713' : '\u2014'}
                  </td>
                  <td>
                    <select
                      className="admin-lang-select"
                      value={g.lang ?? 'es'}
                      disabled={savingId === g.id}
                      onChange={(e) => setLang(g, e.target.value)}
                      aria-label={`Language for ${g.display_name}`}
                    >
                      <option value="es">ES</option>
                      <option value="fr">FR</option>
                    </select>
                  </td>
                  <td>
                    {g.attending === null ? (
                      <span className="status-pending">Pending</span>
                    ) : g.attending ? (
                      <span className="status-yes">Yes</span>
                    ) : (
                      <span className="status-no">No</span>
                    )}
                  </td>
                  <td>{g.responded_at ? new Date(g.responded_at).toLocaleDateString() : '\u2014'}</td>
                  <td>
                    <a href={`/${g.slug}${g.lang === 'fr' ? '?lang=fr' : ''}`}>
                      {`${origin}/${g.slug}${g.lang === 'fr' ? '?lang=fr' : ''}`}
                    </a>
                  </td>
                  <td>
                    <button
                      className="csv-btn"
                      type="button"
                      onClick={() => copyInviteLink(g)}
                    >
                      {copiedId === g.id ? 'Copied!' : 'Copy'}
                    </button>
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
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={11}>
                  {guests.length === 0 ? 'No guests added yet.' : 'No guests match your search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sorted.length > 0 && (
        <div className="admin-pagination">
          <button
            type="button"
            className="csv-btn"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="admin-pagination-info">
            Showing {start + 1}-{Math.min(start + PER_PAGE, sorted.length)} of {sorted.length} invites
          </span>
          <button
            type="button"
            className="csv-btn"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
