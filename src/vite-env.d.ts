/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_NASA_API_KEY?: string
    readonly VITE_NASA_PROXY_URL?: string
    readonly VITE_ISS_PROXY_URL?: string
    readonly VITE_LOCATION_LABEL?: string
    readonly VITE_LOCATION_LAT?: string
    readonly VITE_LOCATION_LON?: string
    readonly VITE_ISS_PASSES?: string
    readonly VITE_MARS_DEFAULT_SOL?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}
