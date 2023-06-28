export type Education = {
  /**
   * @label Establishment
   */
  establishment: string;
  /**
   * @label Program
   */
  program: string;
  /**
   * @label Start Date
   */
  startDate: Date;
  /**
   * @label End Date
   */
  endDate: Date;
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
  credentialType: string;
  /**
   * @label Achievements
   */
  achievements: string[];
};
