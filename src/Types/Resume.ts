import { Person } from './Person';
import { Employment } from './Employment';
import { Education } from './Education';

export type Resume = {
  subject: Person;
  /**
   * @label Objective
   * */
  objective: string;
  date: Date;
  employment: Employment[];
  education: Education[];
  references: Person[];
};
