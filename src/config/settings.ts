const getEnv = (key: keyof ImportMetaEnv, fallback?: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key]
  }
  if (typeof process !== 'undefined' && process.env && key in process.env) {
    return process.env[key as string]
  }
  return fallback
}

const toNumber = (value: string | undefined, fallback: number): number => {
  if (value === undefined || value === '') return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const appSettings = {
  location: {
    label: getEnv('VITE_LOCATION_LABEL', 'Buchloe') ?? 'Buchloe',
    lat: toNumber(getEnv('VITE_LOCATION_LAT'), 48.0833),
    lon: toNumber(getEnv('VITE_LOCATION_LON'), 10.8333),
  },
  iss: {
    passCount: toNumber(getEnv('VITE_ISS_PASSES'), 3),
  },
  mars: {
    defaultSol: toNumber(getEnv('VITE_MARS_DEFAULT_SOL'), 1000),
  },
}
