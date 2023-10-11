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
  startDate: Date | string
  /**
   * @label End Date
   * */
  endDate: Date | string;
  /**
   * @label Projects
   * @itemName `name`
   * */
  projects?: Project[];
};
