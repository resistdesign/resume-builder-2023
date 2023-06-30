import { URL } from '../System/HelperTypes';

/**
 * @label Social
 * @itemName `name`
 * @displayLayout
 * name url
 */
export type SocialNetwork = {
  /**
   * @label Name
   * */
  name: string;
  /**
   * @label URL
   */
  url: URL;
};
