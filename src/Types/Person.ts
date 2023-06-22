import { Address } from './Address';

/**
 * @layout:
 *   name
 *   description
 *   phone email
 *   address
 * */
export type Person = {
  /**
   * @layout:
   *   first middle last
   * */
  name: {
    first: string;
    middle: string;
    last: string;
  };
  description: string;
  phone: string;
  email: string;
  /**
   * @inline
   * @layout:
   *   line1
   *   line2
   *   city state zip
   *   country
   * */
  address: Address;
};
