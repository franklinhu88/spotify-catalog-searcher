export interface Artist {
  name?: string;
  genres?: string[];
  followers?: Followers;
}

export interface Followers {
  href?: any;
  total?: number;
}
