import { Project } from './Project';

export type Employment = {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  projects: Project[];
};
