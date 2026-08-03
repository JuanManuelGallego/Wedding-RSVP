import { t } from '../../../lib/i18n';
import type { Locale } from '../../../lib/types';

export default function StorySection({ locale }: { locale: Locale }) {
  return (
    <section>
      <div className="wrap">
        <h2 className="section-title">{t(locale, 'storyTitle')}</h2>
        <div className="story-block">
          <h3>{t(locale, 'storyHowWeMet')}</h3>
          <p>{t(locale, 'storyHowWeMetBody')}</p>
          <h3>{t(locale, 'storyProposal')}</h3>
          <p>{t(locale, 'storyProposalBody')}</p>
        </div>
      </div>
    </section>
  );
}
