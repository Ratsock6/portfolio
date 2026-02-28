export type LinkItem = { label: string; url: string };

export type BaseItem = {
  slug: string;
  title: string;
  shortDescription: string;
  contentMd?: string;
  longDescription?: string;
  tags: string[];
  period: string;
  role: string;
  highlights: string[];
  links?: LinkItem[];

  media?: { image?: string; alt?: string };
  logo?: { src: string; alt?: string };
};