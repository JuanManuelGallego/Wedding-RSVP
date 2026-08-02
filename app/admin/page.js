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

  const responded = (guests || []).filter((g) => g.attending !== null);
  const totalInvited = guests?.length || 0;
  const respondedCount = responded.length;
  const attendingHeadcount = responded
    .filter((g) => g.attending)
    .reduce((sum, g) => sum + (g.party_size || 0), 0);

  const csvRows = responded.map((g) => ({
    guestName: g.display_name,
    attending: g.attending,
    partySize: g.party_size,
    whatsapp: g.whatsapp || '',
    respondedAt: g.responded_at,
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
          <strong>{respondedCount}</strong>
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
                <th>WhatsApp</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {(guests || []).map((g) => (
                <tr key={g.id}>
                  <td>{g.display_name}</td>
                  <td>{g.party_size}</td>
                  <td>{g.whatsapp || '—'}</td>
                  <td>
                    <a href={`/rsvp/${g.slug}`}>{`${origin}/rsvp/${g.slug}`}</a>
                  </td>
                </tr>
              ))}
              {(!guests || guests.length === 0) && (
                <tr>
                  <td colSpan={4}>No guests added yet.</td>
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
                <th>Responded</th>
              </tr>
            </thead>
            <tbody>
              {responded.map((g) => (
                <tr key={g.id}>
                  <td>{g.display_name}</td>
                  <td>{g.attending ? 'Yes' : 'No'}</td>
                  <td>{g.party_size}</td>
                  <td>{new Date(g.responded_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {responded.length === 0 && (
                <tr>
                  <td colSpan={4}>No responses yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
