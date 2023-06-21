import { Person } from './Person';
import { Employment } from './Employment';
import { Education } from './Education';

export type Resume = {
  subject: Person;
  objective: string;
  date: string;
  employment: Employment[];
  education: Education[];
  references: Person[];
};
