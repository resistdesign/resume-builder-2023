import { Project } from './Project';

export type Employment = {
  /**
   * @label Company
   * */
  company: string;
  /**
   * @label Position
   * */
  position: string;
  /**
   * @label Start Date
   * */
  startDate: string;
  /**
   * @label End Date
   * */
  endDate: string;
  /**
   * @label Projects
   * */
  projects: Project[];
};
