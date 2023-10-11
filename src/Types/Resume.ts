import { Person } from './Person';
import { Employment } from './Employment';
import { Education } from './Education';
import { LongText } from '../System/HelperTypes';
import { Skill } from './Skill';

/**
 * @label Resume
 * */
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
  date: Date | string;
  /**
   * @label Skills
   * @itemName `description`
   * */
  skills: Skill[];
  /**
   * @label Employment
   * @itemName `company`
   * */
  employment: Employment[];
  /**
   * @label Education
   * @itemName `establishment`
   * */
  education: Education[];
  /**
   * @label References
   * @itemName `name`
   * */
  references: Person[];
};
