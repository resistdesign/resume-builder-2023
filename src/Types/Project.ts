import { Skill } from './Skill';
import { NotableConcept } from './NotableConcept';

export type Project = {
  name: string;
  description: string;
  skills: Skill[];
  notableConcepts: NotableConcept[];
};
