import { fetchCelestialEvents } from '@/api/nasa/events'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

import { AppleIntro } from '@/components/sections/AppleIntro'
import { TodaySkyCard } from '@/components/sections/TodaySkyCard'
import { PlanetsCard } from '@/components/sections/PlanetsCard'
import { MeteorCard } from '@/components/sections/MeteorCard'
import { NasaHighlightsCard } from '@/components/sections/NasaHighlightsCard'
import { PersonalCard } from '@/components/sections/PersonalCard'
import { CelestialEventsList } from '@/components/sections/CelestialEventsList'
import { useSectionMotion } from '@/hooks/useSectionMotion'

function App() {
  const celestialEventsQuery = useAsyncData(() => fetchCelestialEvents(60), [])
  const [introDone, setIntroDone] = useState(false)
  const { pageRef } = useSectionMotion()
  const bloomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!introDone || !pageRef.current) return

    const pageEl = pageRef.current
    const bloomEl = bloomRef.current

    const tl = gsap.timeline()

    tl.fromTo(
      pageEl,
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power2.out', delay: 0.15 },
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

  return (
    <div className="app-shell">
      <div ref={bloomRef} className="page-bloom" />
      {/* --- Apple Cinematic Intro --- */}
      <AppleIntro onDone={() => setIntroDone(true)} />

      {/* --- Apple Landingpage Content --- */}
      <main
        ref={pageRef}
        className={`page ${introDone ? 'page--visible' : 'page--hidden'}`}
      >

        {/* SECTION 1 – Heute über Buchloe */}
        <section className="section">
          <header className="section-header">
            <h2>Heute über Buchloe</h2>
            <p className="section-sub">
              Sonne, Mond, Planeten & Sternbilder – direkt für dich.
            </p>
          </header>

          <div className="section-cards">
            <TodaySkyCard events={celestialEventsQuery.data} />
            <PlanetsCard />
            <MeteorCard />
          </div>
        </section>

        {/* SECTION 2 – Deep Sky & Ereignisse */}
        <section className="section">
          <header className="section-header">
            <h2>Deep Sky & Beobachtungen</h2>
          </header>

          <div className="section-cards">
            <CelestialEventsList
              events={celestialEventsQuery.data}
              status={celestialEventsQuery.status}
            />
          </div>
        </section>

        {/* SECTION 3 – NASA Highlights */}
        <section className="section">
          <header className="section-header">
            <h2>NASA Highlights</h2>
          </header>

          <NasaHighlightsCard />
        </section>

        {/* SECTION 4 – Für Dich */}
        <section className="section">
          <header className="section-header">
            <h2>Für dich</h2>
            <p className="section-sub">
              Persönliche Botschaften, Geschichten & besondere Momente.
            </p>
          </header>

          <PersonalCard events={celestialEventsQuery.data} />
        </section>

      </main>
    </div>
  )
}

export default App
