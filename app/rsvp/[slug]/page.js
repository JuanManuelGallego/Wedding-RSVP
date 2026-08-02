import { createAdminClient } from '../../../lib/supabaseAdmin';
import RSVPForm from '../../components/RSVPForm';

export const dynamic = 'force-dynamic';

export default async function GuestRSVPPage({ params }) {
  const supabaseAdmin = createAdminClient();
  const { data: guest } = await supabaseAdmin
    .from('guests')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!guest) {
    return (
      <main>
        <section className="hero" style={{ borderTop: 'none' }}>
          <div className="wrap">
            <p className="eyebrow">Hm</p>
            <p style={{ fontSize: 18 }}>
              We couldn&apos;t find an invitation at this link. Please double-check the
              link, or reach out to Nora &amp; Theo directly.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const { data: existingRsvp } = await supabaseAdmin
    .from('rsvps')
    .select('*')
    .eq('guest_id', guest.id)
    .maybeSingle();

  return (
    <main>
      <section className="hero" style={{ borderTop: 'none', padding: '80px 0 40px' }}>
        <div className="wrap">
          <p className="eyebrow">You&apos;re invited</p>
          <h1 className="names" style={{ fontSize: 'clamp(30px, 7vw, 48px)' }}>
            {guest.display_name}
          </h1>
          <p className="hero-date">Saturday, September 12, 2026</p>
          <p className="hero-place">Camden Hills, Maine</p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2 className="section-title">RSVP</h2>
          <RSVPForm guest={guest} existingRsvp={existingRsvp} />
        </div>
      </section>

      <footer>
        <p>With love, Nora &amp; Theo</p>
      </footer>
    </main>
  );
}
