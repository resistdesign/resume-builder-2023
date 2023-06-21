import { Project } from './Project';

export type Employment = {
  company: string;
  position: string;
  date: string;
  projects: Project[];
};
