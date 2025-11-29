declare module 'suncalc' {
  export interface TimesResult {
    sunrise: Date
    sunset: Date
    [key: string]: Date
  }

  export interface MoonTimesResult {
    rise?: Date
    set?: Date
    alwaysUp?: boolean
    alwaysDown?: boolean
  }

  export interface MoonIlluminationResult {
    fraction: number
    phase: number
    angle: number
  }

  export function getTimes(date: Date, latitude: number, longitude: number): TimesResult
  export function getMoonTimes(
    date: Date,
    latitude: number,
    longitude: number,
    inUTC?: boolean,
  ): MoonTimesResult
  export function getMoonIllumination(date: Date): MoonIlluminationResult

  const SunCalc: {
    getTimes: typeof getTimes
    getMoonTimes: typeof getMoonTimes
    getMoonIllumination: typeof getMoonIllumination
  }

  export default SunCalc
}
