export type ApiEnvironment = 'development' | 'production'

export interface ApiConfig {
  nasaBaseUrl: string
  openNotifyBaseUrl: string
  gibsBaseUrl: string
  defaultTimeoutMs: number
  useClientApiKey: boolean
}

const getEnvVar = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key as keyof ImportMetaEnv] as string | undefined
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key]
  }
  return undefined
}

const nasaProxyOverride = getEnvVar('VITE_NASA_PROXY_URL')
const issProxyOverride = getEnvVar('VITE_ISS_PROXY_URL')
const fallbackNasaBase = 'https://api.nasa.gov'
const fallbackIssBase = 'https://api.open-notify.org'

const configs: Record<ApiEnvironment, ApiConfig> = {
  development: {
    nasaBaseUrl: nasaProxyOverride || fallbackNasaBase,
    openNotifyBaseUrl: issProxyOverride || fallbackIssBase,
    gibsBaseUrl: 'https://gibs.earthdata.nasa.gov',
    defaultTimeoutMs: 12_000,
    useClientApiKey: !nasaProxyOverride,
  },
  production: {
    nasaBaseUrl: nasaProxyOverride || fallbackNasaBase,
    openNotifyBaseUrl: issProxyOverride || fallbackIssBase,
    gibsBaseUrl: 'https://gibs.earthdata.nasa.gov',
    defaultTimeoutMs: 12_000,
    useClientApiKey: !nasaProxyOverride,
  },
}

const resolvedMode =
  typeof import.meta !== 'undefined'
    ? ((import.meta.env.MODE as ApiEnvironment | undefined) ?? 'development')
    : 'development'

export const activeApiConfig = configs[resolvedMode]
export const shouldUseClientApiKey = activeApiConfig.useClientApiKey
