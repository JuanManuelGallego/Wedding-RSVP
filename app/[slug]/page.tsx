import { createAdminClient } from '@/lib/supabaseAdmin';
import { t } from '@/lib/i18n';
import { getLocale, resolveLocale } from '@/lib/locale';
import VideoInvite from '@/app/components/rsvp/VideoInvite';
import LanguageToggle from '@/app/components/shared/LanguageToggle';

export const dynamic = 'force-dynamic';

export default async function VideoInvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const supabaseAdmin = createAdminClient();

  const { data: guest } = await supabaseAdmin
    .from('guests')
    .select('*')
    .eq('slug', slug)
    .single();

  if (guest && !guest.viewed_at) {
    await supabaseAdmin
      .from('guests')
      .update({ viewed_at: new Date().toISOString() })
      .eq('id', guest.id);
    guest.viewed_at = new Date().toISOString();
  }

  const locale = resolveLocale({
    cookie: await getLocale(),
    param: sp?.lang,
    fallback: guest?.lang,
  });

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
