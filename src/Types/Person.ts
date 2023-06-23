import { Address } from './Address';

/**
 * @layout
 *   name
 *   description
 *   phone email
 *   address
 * @label Person
 * @itemName `name`
 * */
export type Person = {
  /**
   * @layout
   *   first middle last
   * @itemName `first` `last`
   * */
  name: {
    /**
     * @label First Name
     * */
    first: string;
    /**
     * @label Middle Name
     */
    middle: string;
    /**
     * @label Last Name
     */
    last: string;
  };
  /**
   * @label Description
   */
  description: string;
  /**
   * @label Phone
   */
  phone: string;
  /**
   * @label Email
   */
  email: string;
  /**
   * @label Address
   * @inline
   * @layout
   *   line1
   *   line2
   *   city state zip
   *   country
   * */
  address: Address;
};
