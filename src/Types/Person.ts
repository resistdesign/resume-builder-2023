import { Address } from './Address';

/**
 * @layout: name
 *   first, middle, last
 * */
export type Person = {
  name: {
    first: string;
    middle: string;
    last: string;
  };
  description: string;
  phone: string;
  email: string;
  address: Address;
};
