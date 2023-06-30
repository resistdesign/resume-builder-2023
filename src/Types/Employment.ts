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
  startDate: Date;
  /**
   * @label End Date
   * */
  endDate: Date;
  /**
   * @label Projects
   * @itemName `name`
   * */
  projects: Project[];
};
