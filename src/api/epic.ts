import fetchResource from './fetchResource';

export interface CentroidCoordinates {
  lat: number;
  lon: number;
}

export interface DscovrJ2000Position {
  x: number;
  y: number;
  z: number;
}

export interface LunarJ2000Position {
  x: number;
  y: number;
  z: number;
}

export interface SunJ2000Position {
  x: number;
  y: number;
  z: number;
}

export interface AttitudeQuaternions {
  q0: number;
  q1: number;
  q2: number;
  q3: number;
}

export interface CentroidCoordinates2 {
  lat: number;
  lon: number;
}

export interface DscovrJ2000Position2 {
  x: number;
  y: number;
  z: number;
}

export interface LunarJ2000Position2 {
  x: number;
  y: number;
  z: number;
}

export interface SunJ2000Position2 {
  x: number;
  y: number;
  z: number;
}

export interface AttitudeQuaternions2 {
  q0: number;
  q1: number;
  q2: number;
  q3: number;
}

export interface Coords {
  centroid_coordinates: CentroidCoordinates2;
  dscovr_j2000_position: DscovrJ2000Position2;
  lunar_j2000_position: LunarJ2000Position2;
  sun_j2000_position: SunJ2000Position2;
  attitude_quaternions: AttitudeQuaternions2;
}

export interface Metadata {
  identifier: string;
  caption: string;
  image: string;
  image_src: string;
  thumbnail_src: string;
  version: string;
  centroid_coordinates: CentroidCoordinates;
  dscovr_j2000_position: DscovrJ2000Position;
  lunar_j2000_position: LunarJ2000Position;
  sun_j2000_position: SunJ2000Position;
  attitude_quaternions: AttitudeQuaternions;
  date: string;
  coords: Coords;
}

export interface Photos {
  photos?: Metadata[];
  error: boolean;
}

export interface PhotoDate {
  date: string;
}

export interface Dates {
  dates?: PhotoDate;
  error: boolean;
}

export enum Color {
  ENHANCED = 'enhanced',
  NATURAL = 'natural',
}

export class EpicImagery {
  readonly endpoint = 'https://api.nasa.gov/EPIC/api';

  constructor(
    private readonly api_key: string = process.env.NASA_API_KEY || 'DEMO_KEY'
  ) {}

  imageSrc(
    color: Color,
    metadata: Metadata,
    type: 'png' | 'jpg' | 'thumbs' = 'jpg',
    ext = type === 'thumbs' ? 'jpg' : type
  ) {
    const date = metadata.date.split(' ')[0].replace(/-/g, '/');
    return `https://api.nasa.gov/EPIC/archive/${color}/${date}/${type}/${metadata.image}.${ext}?api_key=${this.api_key}`;
  }

  async recent(color: Color): Promise<Photos> {
    try {
      const photos: Metadata[] = await fetchResource(
        `${this.endpoint}/${color}?api_key=${this.api_key}`
      );

      for (const metadata of photos ?? []) {
        metadata.image_src = this.imageSrc(color, metadata);
        metadata.thumbnail_src = this.imageSrc(color, metadata, 'thumbs');
      }

      return { error: false, photos };
    } catch (e) {
      console.error(e?.stack ?? e);
      return { error: true };
    }
  }

  async all(color: Color): Promise<Dates> {
    try {
      const dates = await fetchResource(
        `${this.endpoint}/${color}/all?api_key=${this.api_key}`
      );

      return { error: false, dates };
    } catch (e) {
      console.error(e?.stack ?? e);
      return { error: true };
    }
  }

  async date(color: Color, date: string): Promise<Photos> {
    try {
      const photos: Metadata[] = await fetchResource(
        `${this.endpoint}/${color}/date/${date}?api_key=${this.api_key}`
      );

      for (const metadata of photos ?? []) {
        metadata.image_src = this.imageSrc(color, metadata);
        metadata.thumbnail_src = this.imageSrc(color, metadata, 'thumbs');
      }

      return { error: false, photos };
    } catch (e) {
      console.error(e?.stack ?? e);
      return { error: true };
    }
  }
}
