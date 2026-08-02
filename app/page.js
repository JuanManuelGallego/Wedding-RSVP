import { t } from '../lib/i18n';
import { getLocale } from '../lib/locale';
import { site } from '../lib/site';
import LanguageToggle from './components/LanguageToggle';
import TheDay from './components/TheDay';
import StorySection from './components/StorySection';
import GallerySection from './components/GallerySection';

export default function Home() {
  const locale = getLocale();

  return (
    <main>
      <LanguageToggle />

      <section className="hero" style={{ borderTop: 'none' }}>
        <div className="hero-amp" aria-hidden="true">&</div>
        <div className="wrap">
          <p className="eyebrow">{t(locale, 'eyebrow')}</p>
          <h1 className="names">
            {site.first} <em>&</em> {site.second}
          </h1>
          <p className="hero-date">{t(locale, 'date')}</p>
          <p className="hero-place">{t(locale, 'place')}</p>
        </div>
      </section>

      <TheDay locale={locale} />
      <StorySection locale={locale} />
      <GallerySection locale={locale} />

      <section>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="section-title">{t(locale, 'rsvpTitle')}</h2>
          <p>{t(locale, 'rsvpNote')}</p>
        </div>
      </section>

      <footer>
        <p>{t(locale, 'footer')}</p>
      </footer>
    </main>
  );
}
