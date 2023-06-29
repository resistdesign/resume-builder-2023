import { Skill } from './Skill';
import { NotableConcept } from './NotableConcept';

export type Project = {
  /**
   * @label Name
   * */
  name: string;
  /**
   * @label Description
   * */
  description: string;
  /**
   * @label Skills
   * @itemName `description`
   * */
  skills: Skill[];
  /**
   * @label Notable Concepts
   * @itemName `description`
   * */
  notableConcepts: NotableConcept[];
};
