import { createAdminClient } from '../../../lib/supabaseAdmin';
import { t } from '../../../lib/i18n';
import { getLocale } from '../../../lib/locale';
import { site } from '../../../lib/site';
import RSVPForm from '../../components/RSVPForm';
import LanguageToggle from '../../components/LanguageToggle';
import TheDay from '../../components/TheDay';
import StorySection from '../../components/StorySection';
import GallerySection from '../../components/GallerySection';

export const dynamic = 'force-dynamic';

export default async function GuestRSVPPage({ params }) {
  const locale = getLocale();
  const supabaseAdmin = createAdminClient();

  const { data: guest } = await supabaseAdmin
    .from('guests')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!guest) {
    return (
      <main>
        <LanguageToggle />
        <section className="hero" style={{ borderTop: 'none' }}>
          <div className="wrap">
            <p className="eyebrow">{t(locale, 'hm')}</p>
            <p style={{ fontSize: 18 }}>{t(locale, 'notFound')}</p>
          </div>
        </section>
        <footer>
          <p>{t(locale, 'footer')}</p>
        </footer>
      </main>
    );
  }

  return (
    <main>
      <LanguageToggle />

      <section className="hero" style={{ borderTop: 'none', padding: '80px 0 40px' }}>
        <div className="wrap">
          <p className="eyebrow">{t(locale, 'invitedEyebrow')}</p>
          <h1 className="names" style={{ fontSize: 'clamp(30px, 7vw, 48px)' }}>
            {guest.display_name}
          </h1>
          <p className="hero-couple">{site.names}</p>
          <p className="hero-date" style={{ marginTop: 12 }}>
            {t(locale, 'date')}
          </p>
          <p className="hero-place">{t(locale, 'place')}</p>
        </div>
      </section>

      <TheDay locale={locale} />
      <StorySection locale={locale} />
      <GallerySection locale={locale} />

      <section>
        <div className="wrap">
          <h2 className="section-title">{t(locale, 'rsvpTitle')}</h2>
          <RSVPForm guest={guest} locale={locale} />
        </div>
      </section>

      <footer>
        <p>{t(locale, 'footer')}</p>
      </footer>
    </main>
  );
}
