import fetchResource from './fetchResource';

export enum RoverType {
  CURIOSITY = 'curiosity',
  OPPORTUNITY = 'opportunity',
  SPIRIT = 'spirit',
  PERSEVERANCE = 'perseverance',
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
  EDL_RUCAM = 'edl_rucam',
  EDL_DDCAM = 'edl_ddcam',
  EDL_PUCAM1 = 'edl_pucam1',
  EDL_PUCAM2 = 'edl_pucam2',
  NAVCAM_LEFT = 'navcam_left',
  NAVCAM_RIGHT = 'navcam_right',
  MCZ_RIGHT = 'mcz_right',
  MCZ_LEFT = 'mcz_left',
  FRONT_HAZCAM_LEFT_A = 'front_hazcam_left_a',
  FRONT_HAZCAM_RIGHT_A = 'front_hazcam_right_a',
  REAR_HAZCAM_LEFT = 'rear_hazcam_left',
  REAR_HAZCAM_RIGHT = 'rear_hazcam_right',
  EDL_RDCAM = 'edl_rdcam',
  SKYCAM = 'skycam',
  SHERLOC_WATSON = 'sherloc_watson',
  SUPERCAM_RMI = 'supercam_rmi',
  LCAM = 'lcam',
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
  [RoverType.PERSEVERANCE]: '/images/perseverance.jpg',
};

export class MarsPhotos {
  readonly endpoint = 'https://api.nasa.gov/mars-photos/api/v1';

  constructor(
    private readonly api_key: string = process.env.NASA_API_KEY || 'DEMO_KEY'
  ) {}

  async photos(rover: RoverType, opts: RoversQuery = {}): Promise<RoverPhotos> {
    let query = `?api_key=${this.api_key}`;

    for (const [key, value] of Object.entries(opts)) {
      if (!value) continue;

      query += `&${key}=${value}`;
    }

    try {
      const response = await fetchResource(
        `${this.endpoint}/rovers/${rover}/photos${query}`
      );

      return { error: false, ...response };
    } catch (e) {
      console.error(e?.stack ?? e);
      return { error: true };
    }
  }

  async latest_photos(rover: RoverType): Promise<RoverPhotos> {
    try {
      const response = await fetchResource(
        `${this.endpoint}/rovers/${rover}/latest_photos?api_key=${this.api_key}`
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
    try {
      const response = await fetchResource(
        `${this.endpoint}/rovers/${rover}?api_key=${this.api_key}`
      );

      return { error: false, ...response };
    } catch (e) {
      console.error(e?.stack ?? e);
      return { error: true };
    }
  }
}
