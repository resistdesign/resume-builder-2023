export type Address = {
  /**
   * @label Line 1
   */
  line1: string;
  /**
   * @label Line 2
   */
  line2?: string;
  /**
   * @label City
   */
  city: string;
  /**
   * @label State
   * @options StateOptions
   */
  state: string;
  /**
   * @label Country
   * @options CountryOptions
   */
  country: string;
  /**
   * @label Zip
   */
  zip: string;
};
