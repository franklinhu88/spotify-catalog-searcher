export interface Album {
  imageURL: string;
  id: string;
  name: string;
  artists: string[];
  tracks: string[];
  trackCount: number;
  href: string;
  popularity: number;
}
