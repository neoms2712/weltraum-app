import { fetchCelestialEvents } from '@/api/nasa/events'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

import { AppleIntro } from '@/components/sections/AppleIntro'
import { TodaySkyCard } from '@/components/sections/TodaySkyCard'
import { PlanetsCard } from '@/components/sections/PlanetsCard'
import { MeteorCard } from '@/components/sections/MeteorCard'
import { NasaHighlightsCard } from '@/components/sections/NasaHighlightsCard'
import { CelestialEventsList } from '@/components/sections/CelestialEventsList'
import { useSectionMotion } from '@/hooks/useSectionMotion'
import { useFadeIn } from '@/hooks/useFadeIn'
import { MomentsCard } from '@/components/sections/MomentsCard'
import { useSectionAnimate } from '@/hooks/useSectionAnimate'
import { CosmicPersonalityCard } from '@/components/sections/CosmicPersonalityCard'
import { MiniStarmapCard } from '@/components/sections/MiniStarmapCard'
import { Starfield } from '@/components/visuals/Starfield'
import { ShootingStar } from '@/components/visuals/ShootingStar'
import { ConstellationCard } from '@/components/visuals/ConstellationCard'
import { AmbientLayer } from '@/components/visuals/AmbientLayer'
import { AstralTimeline } from '@/components/sections/AstralTimeline'
import { ObservatoryPanels } from '@/components/sections/ObservatoryPanels'

function App() {
  const celestialEventsQuery = useAsyncData(() => fetchCelestialEvents(60), [])
  const [introDone, setIntroDone] = useState(false)
  const { pageRef } = useSectionMotion()
  useFadeIn()
  const bloomRef = useRef<HTMLDivElement | null>(null)
  const sectionOneRef = useSectionAnimate()
  const sectionTwoRef = useSectionAnimate()
  const sectionMomentsRef = useSectionAnimate()
  const sectionObservatoryRef = useSectionAnimate()
  const sectionConstellationRef = useSectionAnimate()
  const sectionThreeRef = useSectionAnimate()
  const sectionFourRef = useSectionAnimate()

  useEffect(() => {
    if (!introDone || !pageRef.current) return

    const pageEl = pageRef.current
    const bloomEl = bloomRef.current

    const tl = gsap.timeline()

    tl.fromTo(
      pageEl,
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power1.out', delay: 0.15 },
    )

    if (bloomEl) {
      tl.fromTo(
        bloomEl,
        { opacity: 0 },
        { opacity: 0.85, duration: 0.18, ease: 'power1.out' },
        0,
      ).to(bloomEl, { opacity: 0, duration: 0.28, ease: 'power2.out' })
    }

    return () => {
      tl.kill()
    }
  }, [introDone, pageRef])

  useEffect(() => {
    const handleScroll = () =>
      document.documentElement.style.setProperty('--scroll', String(window.scrollY))
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app-shell">
      <div className="page-ambient" />
      {/* MINI-D: Ambient Cosmic Pulses */}
      <div className="cosmic-layer">
        <div className="cosmic-pulse" style={{ top: '22%', left: '12%' }} />
        <div className="cosmic-pulse" style={{ top: '78%', left: '28%' }} />
        <div className="cosmic-pulse" style={{ top: '40%', left: '80%' }} />
        <div className="cosmic-pulse" style={{ top: '12%', left: '65%' }} />
      </div>
      <div ref={bloomRef} className="page-bloom" />
      {/* --- Apple Cinematic Intro --- */}
      <AppleIntro onDone={() => setIntroDone(true)} />

      {/* --- Apple Landingpage Content --- */}
      <main
        ref={pageRef}
        className={`page ${introDone ? 'page--visible' : 'page--hidden'}`}
      >

        {/* SECTION 1 – Heute über Buchloe */}
        <section
          ref={sectionOneRef}
          className="section section--hero fade-section"
          data-depth="1"
          data-parallax="true"
        >
          <AmbientLayer variant="soft-stars" />
          <div className="section-glow" />
          <header className="section-header">
            <p className="section-kicker">Lokaler Himmel</p>
            <h2 className="parallax-text">Heute über Buchloe</h2>
            <p className="section-sub subhead">
              Sonne, Mond, Planeten & Sternbilder – direkt für dich.
            </p>
          </header>
          <p className="timeline-intro">Heute im Fokus – wische für Details.</p>
          <AstralTimeline />

          <div className="section-cards">
            <TodaySkyCard events={celestialEventsQuery.data} />
            <PlanetsCard />
            <MeteorCard />
            <MiniStarmapCard />
          </div>
        </section>

        <Starfield />

        <section className="section section--bridge">
          <p className="accent-text">
            Die wichtigsten Himmelsereignisse des Monats – klar strukturiert für dich.
          </p>
        </section>

        {/* SECTION 2 – Deep Sky & Ereignisse */}
        <div className="ambient-divider" />

        <section
          ref={sectionTwoRef}
          className="section section--deep fade-section"
          data-depth="1.4"
          data-parallax="true"
        >
          <div className="section-glow" />
          <header className="section-header">
            <p className="section-kicker">Himmelskalender</p>
            <h2>Deep Sky & Beobachtungen</h2>
            <p className="section-sub subhead">
              Wichtige Sichtbarkeiten und Ereignisse im Überblick.
            </p>
          </header>

          <div className="section-cards">
            <CelestialEventsList
              events={celestialEventsQuery.data}
              status={celestialEventsQuery.status}
            />
          </div>
        </section>

        <ObservatoryPanels ref={sectionObservatoryRef} />

        <section
          ref={sectionMomentsRef}
          className="section section--moments fade-section"
          data-depth="1.8"
          data-parallax="true"
        >
          <AmbientLayer variant="diagonal-dust" />
          <div className="section-glow" />
          <header className="section-header">
            <p className="section-kicker">Guided Highlights</p>
            <h2>Momente & Highlights</h2>
            <p className="section-sub subhead">Kleine Hinweise für den perfekten Weltraumabend.</p>
          </header>
          <div className="section-cards">
            <MomentsCard />
          </div>
        </section>

        <section
          ref={sectionConstellationRef}
          className="section section--constellations constellation-break fade-section"
          data-depth="2"
          data-parallax="true"
        >
          <div className="section-glow" />
          <h3 className="constellation-break__title subhead">
            Sternbilder heute Abend sichtbar
          </h3>
          <div className="constellation-row">
            <ConstellationCard name="Cassiopeia" pattern="cassiopeia" />
            <ConstellationCard name="Orion" pattern="orion" />
            <ConstellationCard name="Lyra" pattern="lyra" />
            <ConstellationCard name="Perseus" pattern="perseus" />
          </div>
        </section>

        {/* SECTION 3 – NASA Highlights */}
        <section
          ref={sectionThreeRef}
          className="section section--nasa fade-section"
          data-depth="2.2"
          data-parallax="true"
        >
          <AmbientLayer variant="soft-aurora" />
          <div className="section-glow" />
          <header className="section-header">
            <p className="section-kicker">Mission Updates</p>
            <h2>NASA Highlights</h2>
            <p className="section-sub subhead">
              Aktuelle Bilder, Missionen und Einblicke aus dem NASA-Kosmos.
            </p>
          </header>

          <NasaHighlightsCard />
        </section>

        <ShootingStar />

        <section className="section section--bridge">
          <p className="accent-text">
            Persönliche Momente – kosmisch und nah zugleich.
          </p>
        </section>

        {/* SECTION 4 – Für Dich */}
        <section
          ref={sectionFourRef}
          className="section section--personal fade-section"
          data-depth="2.5"
          data-parallax="true"
        >
          <AmbientLayer variant="corner-glow" />
          <div className="section-glow" />
          <header className="section-header">
            <p className="section-kicker">Für dich kuratiert</p>
            <h2>Für dich</h2>
            <p className="section-sub subhead">
              Persönliche Botschaften, Geschichten & besondere Momente.
            </p>
          </header>
          <div className="section-cards">
            <CosmicPersonalityCard events={celestialEventsQuery.data} />
          </div>
        </section>

      </main>
    </div>
  )
}

export default App
