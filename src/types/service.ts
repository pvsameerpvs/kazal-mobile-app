import type { IconRef } from './icon';

export type Service = {
  id: string;
  title: string;
  summary: string;
  icon: IconRef;
  description: string;
  features: string[];
};
