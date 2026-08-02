import { t } from '../../lib/i18n';

const PHOTO_COUNT = 12;

export default function GallerySection({ locale }) {
  const photos = Array.from(
    { length: PHOTO_COUNT },
    (_, i) => `/photo-${String(i + 1).padStart(2, '0')}.jpg`
  );

  return (
    <section>
      <div className="wrap">
        <h2 className="section-title">{t(locale, 'galleryTitle')}</h2>
        <div className="gallery-grid">
          {photos.map((src) => (
            <img key={src} className="gallery-photo" src={src} alt="" loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}
