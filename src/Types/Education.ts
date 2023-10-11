export type Education = {
  /**
   * @label Establishment
   */
  establishment: string;
  /**
   * @label Program
   */
  program?: string;
  /**
   * @label Start Date
   */
  startDate: Date | string;
  /**
   * @label End Date
   */
  endDate: Date | string;
  /**
   * @label Credential Type
   * @options
   *  Individual Courses
   *  Certificate
   *  Associate
   *  Bachelors
   *  Masters
   *  Doctorate
   *  Professional
   *  PHD
   * @allowCustomValue
   * */
  credentialType?: string;
  /**
   * @label Achievements
   */
  achievements?: string[];
};
