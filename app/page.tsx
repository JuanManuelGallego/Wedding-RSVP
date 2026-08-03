import { t } from '@/lib/i18n';
import { getLocale, resolveLocale } from '@/lib/locale';
import { site } from '@/lib/site';
import LanguageToggle from '@/app/components/shared/LanguageToggle';
import TheDay from '@/app/components/home/TheDay';
import StorySection from '@/app/components/home/StorySection';
import GallerySection from '@/app/components/home/GallerySection';
import Countdown from '@/app/components/shared/Countdown';
import ScrollReveal from '@/app/components/shared/ScrollReveal';

export default async function Home({ searchParams }: { searchParams?: Record<string, string | undefined> }) {
  const locale = resolveLocale({ cookie: await getLocale(), param: searchParams?.lang });

  return (
    <main>
      <LanguageToggle />

      <section className="hero" style={{ borderTop: 'none' }}>
        <div className="hero-amp" aria-hidden="true">&</div>
        <div className="wrap">
          <p className="eyebrow">{t(locale, 'eyebrow')}</p>
          <h1 className="names">
            {site.first} <em>&amp;</em> {site.second}
          </h1>
          <p className="hero-date">{t(locale, 'date')}</p>
          <p className="hero-place">{t(locale, 'place')}</p>
          <Countdown locale={locale} />
        </div>
      </section>

      <ScrollReveal>
        <TheDay locale={locale} />
      </ScrollReveal>
      <ScrollReveal>
        <StorySection locale={locale} />
      </ScrollReveal>
      <ScrollReveal>
        <GallerySection locale={locale} />
      </ScrollReveal>

      <ScrollReveal>
        <section>
          <div className="wrap" style={{ textAlign: 'center' }}>
            <h2 className="section-title">{t(locale, 'rsvpTitle')}</h2>
            <p>{t(locale, 'rsvpNote')}</p>
          </div>
        </section>
      </ScrollReveal>

      <footer>
        <p>{t(locale, 'footer')}</p>
      </footer>
    </main>
  );
}
