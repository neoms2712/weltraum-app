import SunCalc from 'suncalc'

export interface LocalSkyTimes {
  sunrise: Date
  sunset: Date
  moonrise?: Date | null
  moonset?: Date | null
}

export interface MoonPhaseInfo {
  name: string
  illumination: number
}

const phases: Array<{ threshold: number; name: string }> = [
  { threshold: 0.03, name: 'Neumond' },
  { threshold: 0.22, name: 'Zunehmender Sichelmond' },
  { threshold: 0.28, name: 'Erstes Viertel' },
  { threshold: 0.47, name: 'Zunehmender Mond' },
  { threshold: 0.53, name: 'Vollmond' },
  { threshold: 0.72, name: 'Abnehmender Mond' },
  { threshold: 0.78, name: 'Letztes Viertel' },
  { threshold: 1, name: 'Abnehmender Sichelmond' },
]

export function getMoonPhase(now = new Date()): MoonPhaseInfo {
  const info = SunCalc.getMoonIllumination(now)
  const phase = phases.find((p) => info.phase <= p.threshold) ?? phases[0]
  return { name: phase.name, illumination: info.fraction }
}

export function getLocalSkyTimes(lat: number, lon: number, now = new Date()): LocalSkyTimes {
  const times = SunCalc.getTimes(now, lat, lon)
  const moonTimes = SunCalc.getMoonTimes(now, lat, lon)
  return {
    sunrise: times.sunrise,
    sunset: times.sunset,
    moonrise: moonTimes.rise ?? null,
    moonset: moonTimes.set ?? null,
  }
}
