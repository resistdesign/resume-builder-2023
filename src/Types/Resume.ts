import { Person } from './Person';
import { Employment } from './Employment';
import { Education } from './Education';
import { LongText } from '../System/HelperTypes';

export type Resume = {
  /**
   * @label Subject
   */
  subject: Person;
  /**
   * @label Objective
   * */
  objective: LongText;
  /**
   * @label Date
   * */
  date: Date;
  /**
   * @label Employment
   * @itemName `company`
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
