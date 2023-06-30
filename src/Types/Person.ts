import { Address } from './Address';
import { EmailAddress, TelephoneNumber } from '../System/HelperTypes';
import { SocialNetwork } from './SocialNetwork';

/**
 * @layout
 *   name
 *   description
 *   phone email
 *   address
 *   socialNetworks
 * @displayLayout
 *   name name address address
 *   description description address address
 *   phone email address address
 *   socialNetworks socialNetworks address address
 * @label Person
 * @itemName `name`
 * */
export type Person = {
  /**
   * @layout
   *   first middle last
   * @displayLayout
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
  phone: TelephoneNumber;
  /**
   * @label Email
   */
  email: EmailAddress;
  /**
   * @label Social Networks
   */
  socialNetworks: SocialNetwork[];
  /**
   * @label Address
   * @inline
   * @layout
   *   line1
   *   line2
   *   city state zip
   *   country
   * @displayLayout
   *   line1
   *   line2
   *   city state zip
   *   country
   * */
  address: Address;
};
