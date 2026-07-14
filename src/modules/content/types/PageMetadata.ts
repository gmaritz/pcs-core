export interface PageMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  robots?: string;
  openGraph?: {
    title: string;
    description: string;
    image?: string;
  };
}
