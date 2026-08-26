import { isAuthed } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabaseAdmin';
import AdminLogin from '@/app/components/admin/AdminLogin';
import AddGuestForm from '@/app/components/admin/AddGuestForm';
import ImportGuestsForm from '@/app/components/admin/ImportGuestsForm';
import LogoutButton from '@/app/components/admin/LogoutButton';
import GuestListTable from '@/app/components/admin/GuestListTable';
import type { Guest } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAuthed())) {
    return <AdminLogin />;
  }

  const supabaseAdmin = createAdminClient();

  const { data: guests } = await supabaseAdmin
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  const responded = (guests ?? []).filter((g: Guest) => g.attending !== null);
  const viewed = (guests ?? []).filter((g: Guest) => g.viewed_at !== null);
  const totalInvited = guests?.length ?? 0;
  const respondedCount = responded.length;
  const viewedCount = viewed.length;
  const invitedHeadcount = (guests ?? []).reduce((sum: number, g: Guest) => sum + (g.party_size ?? 0), 0);
  const attendingHeadcount = responded
    .filter((g: Guest) => g.attending)
    .reduce((sum: number, g: Guest) => sum + (g.party_size ?? 0), 0);

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? '';

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
          <strong>{invitedHeadcount}</strong>
          <span>invited (headcount)</span>
        </div>
        <div>
          <strong>{respondedCount}</strong>
          <span>responded</span>
        </div>
        <div>
          <strong>{viewedCount}</strong>
          <span>viewed link</span>
        </div>
        <div>
          <strong>{attendingHeadcount}</strong>
          <span>attending (headcount)</span>
        </div>
      </div>
      
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>All Guests</h2>
        </div>
        <GuestListTable guests={guests ?? []} origin={origin} />
      </section>

      <section className="admin-section">
        <h2>Add a guest</h2>
        <AddGuestForm />
      </section>

      <section className="admin-section">
        <h2>Import guests from CSV</h2>
        <ImportGuestsForm />
      </section>
    </main>
  );
}
