import { AppleCard } from '@/components/ui/AppleCard'
import { moments } from '@/data/moments'

export function MomentsCard() {
  return (
    <AppleCard eyebrow="Momente" title="Momente des Tages" motionPreset="spotlight">
      <div className="moments-strip">
        {moments.map((moment) => (
          <div className="moment-tile moment-card" key={moment.title}>
            <div className="moment-icon-badge">
              <span>{moment.icon}</span>
            </div>
            <strong>{moment.title}</strong>
            <p>{moment.text}</p>
          </div>
        ))}
      </div>
    </AppleCard>
  )
}
