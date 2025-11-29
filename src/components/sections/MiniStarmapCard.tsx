import { AppleCard } from '@/components/ui/AppleCard'
import { ConstellationCard } from '@/components/visuals/ConstellationCard'

export function MiniStarmapCard() {
  return (
    <AppleCard
      eyebrow="Mini-Sternkarte"
      title="Cassiopeia, Orion & Co."
      motionPreset="soft"
    >
      <p className="apple-card-subtext">
        Kleine Sternkarte mit den wichtigsten Sternbildern, die heute Abend sichtbar sind.
      </p>
      <div className="mini-starmap-row">
        <ConstellationCard name="Cassiopeia" pattern="cassiopeia" />
        <ConstellationCard name="Orion" pattern="orion" />
        <ConstellationCard name="Lyra" pattern="lyra" />
      </div>
    </AppleCard>
  )
}
