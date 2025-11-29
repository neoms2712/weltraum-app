import { useMemo } from 'react'
import { AppleCard } from '@/components/ui/AppleCard'
import { getMoonPhase } from '@/api'
import { getConstellationHighlights } from '@/api/astro/sky'
import type { CelestialEvent } from '@/api/astro/celestialEvents'

type CosmicPersonalityCardProps = {
  events: CelestialEvent[] | null
}

const nextEventTitle = (events: CelestialEvent[] | null) => {
  if (!events || events.length === 0) return 'das nächste Himmelsereignis'
  const now = Date.now()
  const future = events
    .map((event) => ({ event, timestamp: new Date(event.date).getTime() }))
    .filter(({ timestamp }) => !Number.isNaN(timestamp) && timestamp >= now)
    .sort((a, b) => a.timestamp - b.timestamp)
  return future[0]?.event.name ?? events[0].name
}

type PersonalityContext = {
  moonName: string
  constellationName: string
  constellationMeaning: string
  eventTitle: string
}

type PersonalityTexts = {
  eyebrow: string
  title: string
  moonText: string
  constellationText: string
  eventText: string
  poetry: string
}

/**
 * 5 ruhige, leicht romantische Varianten.
 * Alle nutzen die gleichen Daten, aber mit anderer Tonalität.
 */
const PERSONALITY_VARIANTS: Array<(ctx: PersonalityContext) => PersonalityTexts> = [
  // V1 – sanft, Fokus auf leise Veränderungen
  ({ moonName, constellationName, constellationMeaning, eventTitle }) => ({
    eyebrow: 'Kosmische Stimmung · Buchloe',
    title: 'Dein Himmelsprofil heute',
    moonText: `Der Mond steht heute in der Phase ${moonName}. Es ist eine dieser Nächte, in denen Veränderungen nicht laut sind – sie liegen eher wie eine leise Ahnung in der Luft.`,
    constellationText: `${constellationName} spannt sich heute über dir – ein Sternbild, das für ${constellationMeaning} steht. Ein stiller Rahmen, der deinem Abend etwas Vertrautes gibt, selbst wenn der Tag sich ungeordnet angefühlt hat.`,
    eventText: `Im Laufe des Abends rückt ${eventTitle} in den Fokus – kein großes Feuerwerk, eher ein kleines Detail, das zeigt, dass sich der Himmel weiterdreht, egal wie voll dein Kopf ist.`,
    poetry: 'Vielleicht reicht es heute, wenn du den Himmel einmal kurz anschaust – der Rest darf einfach nur da sein.',
  }),

  // V2 – etwas konkreter, aber weich
  ({ moonName, constellationName, constellationMeaning, eventTitle }) => ({
    eyebrow: 'Heute über dir · Buchloe',
    title: 'Ein stiller Abendhimmel für dich',
    moonText: `Der Mond als ${moonName} erinnert daran, dass nicht jeder Tag klare Antworten braucht. Manchmal ist es okay, wenn Dinge einfach nur halb fertig, halb sortiert und trotzdem in Ordnung sind.`,
    constellationText: `${constellationName} steht heute sichtbar am Himmel und trägt die Bedeutung von ${constellationMeaning}. Wie ein kleiner Anker weit oben, der sagt: Du musst heute nicht alles neu erfinden.`,
    eventText: `Zwischendurch lenkt der Himmel den Blick auf ${eventTitle}. Ein leiser Höhepunkt des Abends, der dir zeigt, dass auch außerhalb deines Alltags etwas Schönes passiert.`,
    poetry: 'Wenn du magst, nimm diesen Abend als Einladung, für ein paar Minuten nur zuzusehen, statt alles im Griff haben zu müssen.',
  }),

  // V3 – etwas romantischer, mehr "du" ohne kitschig zu werden
  ({ moonName, constellationName, constellationMeaning, eventTitle }) => ({
    eyebrow: 'Abendstimmung · Buchloe',
    title: 'Der Himmel heute, ein bisschen für dich',
    moonText: `Der ${moonName} legt sich wie ein ruhiger Akzent in den Abend. Er passt gut zu Tagen, an denen du zwar müde bist, aber trotzdem noch ein kleines bisschen Raum für dich selbst übrig hast.`,
    constellationText: `${constellationName} steht heute über dir und steht für ${constellationMeaning}. Vielleicht fühlt es sich ein wenig so an, als würde der Himmel dir zuflüstern: Du musst heute niemand anderem etwas beweisen.`,
    eventText: `Später lenkt ${eventTitle} die Aufmerksamkeit noch einmal kurz nach oben – ein Moment, den vermutlich kaum jemand bewusst wahrnimmt. Du dürftest also einer der wenigen Menschen sein, die ihn wirklich sehen.`,
    poetry: 'Und irgendwo zwischen Straßenlicht und Sternen passt genau in diese Nacht ein Gedanke, der nur dir gehört.',
  }),

  // V4 – mehr Fokus auf Ruhe & Entlastung
  ({ moonName, constellationName, constellationMeaning, eventTitle }) => ({
    eyebrow: 'Nachtprofil · Buchloe',
    title: 'Ein ruhiger Himmelsmoment',
    moonText: `Mit dem Mond in der Phase ${moonName} wirkt der Himmel etwas zurückhaltender – als würde er dir absichtlich nicht zu viel abverlangen. Du darfst heute müde sein und trotzdem genug sein.`,
    constellationText: `${constellationName} am Himmel, verbunden mit ${constellationMeaning}, ist wie ein kleiner Reminder, dass nicht jeder Abend produktiv, laut oder besonders sein muss, um gut gewesen zu sein.`,
    eventText: `${eventTitle} schreibt sich leise in den Nachthimmel. Kein Ereignis, das alles verändert – eher eines, das dir zeigt, dass auch der Kosmos seine Routine hat.`,
    poetry: 'Zwischen all dem, was erledigt werden will, bleibt heute ein schmaler Streifen Himmel nur für dich – ganz oben, ganz still.',
  }),

  // V5 – leicht verspielter, aber immer noch ruhig
  ({ moonName, constellationName, constellationMeaning, eventTitle }) => ({
    eyebrow: 'Kleine Himmelsnotiz · Buchloe',
    title: 'Was der Himmel dir heute anbietet',
    moonText: `Der ${moonName} macht den Himmel heute nicht dramatisch, sondern weich. Perfekt für einen Abend, an dem du keine großen Pläne brauchst, sondern einfach nur ankommen darfst.`,
    constellationText: `${constellationName} steht mit der Bedeutung von ${constellationMeaning} über dir. Vielleicht ist das genau der richtige Hintergrund für einen Gedanken, den du bisher immer weggeschoben hast.`,
    eventText: `Ganz nebenbei kündigt der Himmel ${eventTitle} an. Kein Pflichttermin – eher eine Option, kurz stehenzubleiben, tief durchzuatmen und einmal bewusst nach oben zu schauen.`,
    poetry: 'Und falls du dich fragst, ob dieser Tag gereicht hat: Der Himmel hebt für heute einfach still den Daumen.',
  }),
]

/**
 * Liefert einen pseudozufälligen, aber stabilen Index für den aktuellen Tag.
 * - Gleicher Tag = gleiche Variante (kein Springen beim Reload)
 * - Keine simple "jeder Montag ist Variante X"-Logik
 */
const getVariantIndexForToday = (variantCount: number): number => {
  const now = new Date()
  const year = now.getFullYear()
  const startOfYear = new Date(year, 0, 0)
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))

  // einfacher kleiner PRNG auf Basis von Jahr + Tag
  const seed = dayOfYear + year * 17
  const mixed = (seed * 37 + 73) % 997

  return mixed % variantCount
}

export function CosmicPersonalityCard({ events }: CosmicPersonalityCardProps) {
  const moon = useMemo(() => getMoonPhase(), [])
  const constellations = useMemo(() => getConstellationHighlights(), [])

  const constellationName = constellations[0]?.name ?? 'Cassiopeia'
  const constellationMeaning = constellations[0]?.story ?? 'Ruhe und Harmonie'
  const eventTitle = nextEventTitle(events)

  const ctx: PersonalityContext = {
    moonName: moon?.name ?? 'unbekannte Phase',
    constellationName,
    constellationMeaning,
    eventTitle,
  }

  const variantIndex = getVariantIndexForToday(PERSONALITY_VARIANTS.length)
  const personality = PERSONALITY_VARIANTS[variantIndex](ctx)

  return (
    <AppleCard variant={['personal', 'wide']} motionPreset="soft">
      <div className="cosmic-personality personal-gradient">
        <span className="cosmic-personality__badge">
          <span>✨</span>
          {personality.eyebrow}
        </span>
        <h3 className="cosmic-personality__headline">{personality.title}</h3>
        <p className="cosmic-personality__text">{personality.moonText}</p>
        <p className="cosmic-personality__text">{personality.constellationText}</p>
        <p className="cosmic-personality__text">{personality.eventText}</p>
        <p className="cosmic-personality__poetry">{personality.poetry}</p>
      </div>
    </AppleCard>
  )
}
