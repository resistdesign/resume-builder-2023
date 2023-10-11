import { Address } from '../../Types/Address';

export const mdAddress = ({
  line1 = '',
  line2 = '',
  city = '',
  state = '',
  zip = '',
  country = '',
}: Address = {}) => {
  const address = [line1, line2, city, state, zip, country].filter((item) => item).join(', ');

  return address ? `${address}` : '';
};
