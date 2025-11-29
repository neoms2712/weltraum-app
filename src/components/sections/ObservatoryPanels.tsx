import { forwardRef, useMemo } from 'react'
import { appSettings } from '@/config/settings'
import { getMoonPhase, getLocalSkyTimes } from '@/api/astro/localSky'
import { getPlanetVisibilities } from '@/api/astro/sky'

const formatTime = (date: Date | null | undefined) =>
  date ? new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(date) : '–'

export const ObservatoryPanels = forwardRef<HTMLElement>(function ObservatoryPanels(_, ref) {
  const moon = useMemo(() => getMoonPhase(), [])
  const skyTimes = useMemo(
    () => getLocalSkyTimes(appSettings.location.lat, appSettings.location.lon),
    [],
  )
  const planetVis = useMemo(
    () => getPlanetVisibilities().filter((p) => p.visible).sort((a, b) => b.altitude - a.altitude),
    [],
  )

  const planetBarWidth = (alt: number) => {
    const pct = Math.max(0, Math.min(100, Math.round((alt / 90) * 100)))
    return `${pct}%`
  }

  return (
    <section ref={ref} className="section section-observatory fade-section" data-parallax="true">
      <div className="ambient-layer ambient-layer--soft-stars" />
      <div className="section-glow" />
      <div className="section-kicker">Observatorium</div>
      <h2 className="section-title">Wie der Himmel sich heute bewegt</h2>
      <p className="section-sub subhead">
        Mondbahn und Planetensichtbarkeit – lebendig statt statisch.
      </p>

      <div className="observatory-grid">
        <div className="observatory-card">
          <h3 className="observatory-card__title">Mondbahn heute</h3>
          <p className="observatory-card__subtitle">
            Phase: {moon.name} · Auf: {formatTime(skyTimes.moonrise)} · Unter: {formatTime(skyTimes.moonset)}
          </p>
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
            {planetVis.length === 0 && (
              <p className="loading-text">Heute sind keine Planeten über dem Horizont.</p>
            )}
            {planetVis.map((planet) => (
              <div className="obs-bar" key={planet.id}>
                <span className="obs-bar__label">{planet.name}</span>
                <div className="obs-bar__track">
                  <div
                    className="obs-bar__fill obs-bar__fill--primary"
                    style={{ width: planetBarWidth(planet.altitude) }}
                  />
                </div>
                <span className="obs-bar__value">{Math.round(planet.altitude)}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})
