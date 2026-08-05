import type { IconRef } from './icon';

export type SubCategory = {
  title: string;
  caption: string;
  icon: IconRef;
};

export type Service = {
  id: string;
  title: string;
  summary: string;
  icon: IconRef;
  image: string;
  description: string;
  features: string[];
  subCategories: SubCategory[];
};
