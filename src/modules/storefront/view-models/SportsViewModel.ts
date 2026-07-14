export interface SportItemViewModel {
  id: string;
  name: string;
  description: string;
  tagline: string;
  heroImageUrl: string;
  heroImageAlt: string;
  statusLabel: string;
  url: string;
}

export interface SportsViewModel {
  items: SportItemViewModel[];
}
