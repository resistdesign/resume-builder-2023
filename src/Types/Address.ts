export type Address = {
  /**
   * @label Line 1
   */
  line1?: string;
  /**
   * @label Line 2
   */
  line2?: string;
  /**
   * @label City
   */
  city?: string;
  /**
   * @label State / Province
   * @optionsType StateOptions
   * @allowCustomValue
   */
  state?: string;
  /**
   * @label Country
   * @optionsType CountryOptions
   * @allowCustomValue
   */
  country?: string;
  /**
   * @label Zip
   */
  zip?: string;
};
