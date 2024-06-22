export interface Track {
  album: {
    href: string; //endpoint to specific album
  } 
  artists: {
    href: string;
  }[]
  explicit: boolean;
  id: string;
  name: string;
  popularity: number;
}
