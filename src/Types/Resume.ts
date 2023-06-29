import { Person } from './Person';
import { Employment } from './Employment';
import { Education } from './Education';

export type Resume = {
  /**
   * @label Subject
   */
  subject: Person;
  /**
   * @label Objective
   * */
  objective: string;
  /**
   * @label Date
   * */
  date: Date;
  /**
   * @label Employment
   * */
  employment: Employment[];
  /**
   * @label Education
   * */
  education: Education[];
  /**
   * @label References
   * */
  references: Person[];
};
