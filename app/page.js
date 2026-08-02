export default function Home() {
  return (
    <main>
      <section className="hero" style={{ borderTop: 'none' }}>
        <div className="hero-amp" aria-hidden="true">&</div>
        <div className="wrap">
          <p className="eyebrow">Together with their families</p>
          <h1 className="names">
            Nora <em>&</em> Theo
          </h1>
          <p className="hero-date">Saturday, September 12, 2026</p>
          <p className="hero-place">Camden Hills, Maine</p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2 className="section-title">The Day</h2>
          <div className="details-grid">
            <div className="detail-card">
              <p className="detail-label">Ceremony</p>
              <p className="detail-title">4:00 PM</p>
              <p className="detail-meta">Fernwood Orchard</p>
              <p className="detail-meta">14 Orchard Lane, Camden</p>
            </div>
            <div className="detail-card">
              <p className="detail-label">Reception</p>
              <p className="detail-title">6:00 PM</p>
              <p className="detail-meta">The Barn at Fernwood</p>
              <p className="detail-meta">Dinner, dancing, and cake</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="section-title">RSVP</h2>
          <p>
            Please use the personal RSVP link from your invitation to let us know
            you&apos;re coming. Can&apos;t find it? Reach out to Nora &amp; Theo directly.
          </p>
        </div>
      </section>

      <footer>
        <p>With love, Nora &amp; Theo</p>
      </footer>
    </main>
  );
}
