import { NotableConcept } from './NotableConcept';

export type Project = {
  /**
   * @label Name
   * */
  name: string;
  /**
   * @label Description
   * */
  description?: string;
  /**
   * @label Notable Concepts
   * @itemName `description`
   * */
  notableConcepts?: NotableConcept[];
};
