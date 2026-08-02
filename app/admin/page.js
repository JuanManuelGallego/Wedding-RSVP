import { isAuthed } from '../../lib/adminAuth';
import { createAdminClient } from '../../lib/supabaseAdmin';
import AdminLogin from './AdminLogin';
import AddGuestForm from './AddGuestForm';
import ImportGuestsForm from './ImportGuestsForm';
import ExportCsvButton from './ExportCsvButton';
import LogoutButton from './LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!isAuthed()) {
    return <AdminLogin />;
  }

  const supabaseAdmin = createAdminClient();

  const { data: guests } = await supabaseAdmin
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: rsvps } = await supabaseAdmin
    .from('rsvps')
    .select('*, guests(display_name, slug)')
    .order('created_at', { ascending: false });

  const totalInvited = guests?.length || 0;
  const responded = rsvps?.length || 0;
  const attendingHeadcount =
    rsvps?.filter((r) => r.attending).reduce((sum, r) => sum + (r.party_size || 0), 0) || 0;

  const csvRows = (rsvps || []).map((r) => ({
    guestName: r.guests?.display_name || 'Unknown',
    attending: r.attending,
    partySize: r.party_size,
    email: r.email,
    createdAt: r.created_at,
  }));

  const origin = process.env.NEXT_PUBLIC_SITE_URL || '';

  return (
    <main className="admin-wrap">
      <div className="admin-header">
        <h1>RSVP Admin</h1>
        <LogoutButton />
      </div>

      <div className="admin-stats">
        <div>
          <strong>{totalInvited}</strong>
          <span>invited</span>
        </div>
        <div>
          <strong>{responded}</strong>
          <span>responded</span>
        </div>
        <div>
          <strong>{attendingHeadcount}</strong>
          <span>attending (headcount)</span>
        </div>
      </div>

      <section className="admin-section">
        <h2>Add a guest</h2>
        <AddGuestForm />
      </section>

      <section className="admin-section">
        <h2>Import guests from CSV</h2>
        <ImportGuestsForm />
      </section>

      <section className="admin-section">
        <h2>Guest links</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Party size</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {(guests || []).map((g) => (
                <tr key={g.id}>
                  <td>{g.display_name}</td>
                  <td>{g.party_size}</td>
                  <td>
                    <a href={`/rsvp/${g.slug}`}>{`${origin}/rsvp/${g.slug}`}</a>
                  </td>
                </tr>
              ))}
              {(!guests || guests.length === 0) && (
                <tr>
                  <td colSpan={3}>No guests added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Responses</h2>
          <ExportCsvButton rows={csvRows} />
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Attending</th>
                <th>Party size</th>
                <th>Email</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {(rsvps || []).map((r) => (
                <tr key={r.id}>
                  <td>{r.guests?.display_name || 'Unknown'}</td>
                  <td>{r.attending ? 'Yes' : 'No'}</td>
                  <td>{r.party_size}</td>
                  <td>{r.email || '—'}</td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!rsvps || rsvps.length === 0) && (
                <tr>
                  <td colSpan={5}>No responses yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
