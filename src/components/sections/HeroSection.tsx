interface HeroSectionProps {
  videoSrc?: string
  headline?: string
  subline?: string
}

export function HeroSection({
  videoSrc = '/media/Weltallvideo.mp4',
  headline = 'Deine Reise beginnt hier',
  subline = 'Echtzeitdaten, Highlights und lokale Himmelsereignisse in einer Experience.',
}: HeroSectionProps) {
  return (
    <section className="hero-section">
      <video
        className="hero-section__video"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=80"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="hero-section__overlay">
        <p className="hero-section__kicker">Mission Deep Space</p>
        <h2>{headline}</h2>
        <p>{subline}</p>
      </div>
    </section>
  )
}
