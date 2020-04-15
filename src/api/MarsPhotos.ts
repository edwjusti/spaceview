import fetchResource from './fetchResource';

export enum RoverType {
  CURIOSITY,
  OPPORTUNITY,
  SPIRIT,
}

export enum CameraType {
  FHAZ = 'fhaz',
  RHAZ = 'rhaz',
  MAST = 'mast',
  CHEMCAM = 'chemcam',
  MAHLI = 'mahli',
  MARDI = 'mardi',
  NAVCAM = 'navcam',
  PANCAM = 'pancam',
  MINITES = 'minites',
}

export interface PhotoCamera {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

export interface Camera {
  name: string;
  full_name: string;
}

export interface Rover {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date: string;
  total_photos: number;
  cameras: Camera[];
}

export interface Photo {
  id: number;
  sol: number;
  camera: PhotoCamera;
  img_src: string;
  earth_date: string;
  rover: Rover;
}

export interface RoverPhotos {
  photos?: Photo[];
  error: boolean;
}

export interface RoverInfo {
  rover?: Rover;
  error: boolean;
}

export interface RoverList {
  rovers?: Rover[];
  error: boolean;
}

export interface RoversQuery {
  sol?: number;
  camera?: CameraType;
  page?: number;
}

export const roverThumbnails = {
  [RoverType.CURIOSITY]: '/images/curiosity.png',
  [RoverType.OPPORTUNITY]: '/images/opportunity.jpg',
  [RoverType.SPIRIT]: '/images/spirit.jpg',
};

export class MarsPhotos {
  readonly endpoint = 'https://api.nasa.gov/mars-photos/api/v1';

  constructor(
    private readonly api_key: string = process.env.NASA_API_KEY || 'DEMO_KEY'
  ) {}

  async photos(rover: RoverType, opts: RoversQuery = {}): Promise<RoverPhotos> {
    const roverName = RoverType[rover] as string;
    let query = `?api_key=${this.api_key}`;

    for (const [key, value] of Object.entries(opts)) {
      if (!value) continue;

      query += `&${key}=${value}`;
    }

    try {
      const response = await fetchResource(
        `${this.endpoint}/rovers/${roverName}/photos${query}`
      );

      return { error: false, ...response };
    } catch (e) {
      console.error(e?.stack ?? e);
      return { error: true };
    }
  }

  async latest_photos(rover: RoverType): Promise<RoverPhotos> {
    const roverName = RoverType[rover] as string;

    try {
      const response = await fetchResource(
        `${this.endpoint}/rovers/${roverName}/latest_photos?api_key=${this.api_key}`
      );

      return { error: false, ...response };
    } catch (e) {
      console.error(e?.stack ?? e);
      return { error: true };
    }
  }

  async rovers(): Promise<RoverList> {
    try {
      const response = await fetchResource(
        `${this.endpoint}/rovers?api_key=${this.api_key}`
      );

      return { error: false, ...response };
    } catch (e) {
      console.error(e?.stack ?? e);
      return { error: true };
    }
  }

  async rover(rover: RoverType): Promise<RoverInfo> {
    const roverName = RoverType[rover] as string;

    try {
      const response = await fetchResource(
        `${this.endpoint}/rovers/${roverName}?api_key=${this.api_key}`
      );

      return { error: false, ...response };
    } catch (e) {
      console.error(e?.stack ?? e);
      return { error: true };
    }
  }
}
