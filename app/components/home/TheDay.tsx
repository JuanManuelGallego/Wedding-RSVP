import { t } from '../../../lib/i18n';
import type { Locale } from '../../../lib/types';

export default function TheDay({ locale }: { locale: Locale }) {
  return (
    <section>
      <div className="wrap">
        <h2 className="section-title">{t(locale, 'theDay')}</h2>
        <div className="details-grid">
          <div className="detail-card">
            <p className="detail-label">{t(locale, 'ceremony')}</p>
            <p className="detail-title">{t(locale, 'ceremonyTime')}</p>
            <p className="detail-meta">{t(locale, 'ceremonyPlace')}</p>
          </div>
          <div className="detail-card">
            <p className="detail-label">{t(locale, 'reception')}</p>
            <p className="detail-title">{t(locale, 'receptionTime')}</p>
            <p className="detail-meta">{t(locale, 'receptionPlace')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
