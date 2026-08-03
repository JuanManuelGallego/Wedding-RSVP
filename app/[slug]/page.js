import { createAdminClient } from '../../lib/supabaseAdmin';
import { t } from '../../lib/i18n';
import { getLocale, resolveLocale } from '../../lib/locale';
import VideoInvite from '../components/VideoInvite';
import LanguageToggle from '../components/LanguageToggle';

export const dynamic = 'force-dynamic';

export default async function VideoInvitePage({ params, searchParams }) {
  const locale = resolveLocale({ cookie: getLocale(), param: searchParams?.lang });
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
    <>
      <LanguageToggle />
      <VideoInvite guest={guest} locale={locale} />
    </>
  );
}
