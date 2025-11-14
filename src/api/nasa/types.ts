export interface ApodResponse {
  date: string
  explanation: string
  hdurl?: string
  media_type: 'image' | 'video'
  service_version: string
  title: string
  url: string
}

export interface MarsPhotoRaw {
  id: number
  sol: number
  camera: {
    id: number
    name: string
    full_name: string
  }
  img_src: string
  earth_date: string
  rover: {
    id: number
    name: string
    status: string
  }
}

export interface MarsRoverResponse {
  photos: MarsPhotoRaw[]
}

export interface MarsPhoto {
  id: number
  imageUrl: string
  cameraName: string
  earthDate: string
}

export interface NearEarthObjectRaw {
  id: string
  name: string
  estimated_diameter: {
    meters: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
  }
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: Array<{
    close_approach_date_full?: string
    relative_velocity: {
      kilometers_per_hour: string
    }
    miss_distance: {
      kilometers: string
    }
    orbiting_body: string
  }>
}

export interface NeoFeedResponse {
  element_count: number
  near_earth_objects: Record<string, NearEarthObjectRaw[]>
}

export interface NeoHighlight {
  id: string
  name: string
  diameterMeters: number
  hazardous: boolean
  approach: string
  orbitingBody: string
}
