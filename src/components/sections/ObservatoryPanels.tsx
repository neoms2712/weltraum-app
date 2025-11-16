import { forwardRef } from 'react'

export const ObservatoryPanels = forwardRef<HTMLElement>(function ObservatoryPanels(_, ref) {
  return (
    <section ref={ref} className="section section-observatory fade-section" data-parallax="true">
      <div className="ambient-layer ambient-layer--soft-stars" />
      <div className="section-glow" />
      <div className="section-kicker">Observatorium</div>
      <h2 className="section-title">Wie der Himmel sich heute bewegt</h2>
      <p className="section-sub subhead">
        Mondbahn, Planetensichtbarkeit und ein kleiner Blick in deine Sternkarte – minimalistisch
        visualisiert.
      </p>

      <div className="observatory-grid">
        <div className="observatory-card">
          <h3 className="observatory-card__title">Mondbahn heute</h3>
          <p className="observatory-card__subtitle">Vom Aufgang bis zum höchsten Punkt.</p>
          <div className="observatory-visual observatory-visual--arc">
            <svg viewBox="0 0 200 100" className="observatory-arc">
              <path
                d="M10 90 Q 100 10 190 90"
                fill="none"
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="65" r="4" className="observatory-arc__dot" />
              <circle cx="140" cy="35" r="6" className="observatory-arc__moon" />
              <circle cx="190" cy="90" r="3" className="observatory-arc__dot" />
            </svg>
          </div>
        </div>

        <div className="observatory-card">
          <h3 className="observatory-card__title">Planetensichtbarkeit</h3>
          <p className="observatory-card__subtitle">Wer begleitet dich heute am Abendhimmel?</p>
          <div className="observatory-visual observatory-visual--bars">
            <div className="obs-bar">
              <span className="obs-bar__label">Jupiter</span>
              <div className="obs-bar__track">
                <div className="obs-bar__fill obs-bar__fill--primary" style={{ width: '80%' }} />
              </div>
            </div>
            <div className="obs-bar">
              <span className="obs-bar__label">Mars</span>
              <div className="obs-bar__track">
                <div className="obs-bar__fill" style={{ width: '40%' }} />
              </div>
            </div>
            <div className="obs-bar">
              <span className="obs-bar__label">Venus</span>
              <div className="obs-bar__track">
                <div className="obs-bar__fill" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="observatory-card">
          <h3 className="observatory-card__title">Mini-Sternkarte</h3>
          <p className="observatory-card__subtitle">
            Cassiopeia, Perseus &amp; Freunde – als kleine Karte über dir.
          </p>
          <div className="observatory-visual observatory-visual--starmap">
            <div className="starmap">
              <span className="starmap__star starmap__star--a" />
              <span className="starmap__star starmap__star--b" />
              <span className="starmap__star starmap__star--c" />
              <span className="starmap__star starmap__star--d" />
              <span className="starmap__star starmap__star--e" />
              <span className="starmap__connection starmap__connection--cassiopeia" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})
