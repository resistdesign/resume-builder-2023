export const mdAddress = ({ street = '', city = '', state = '', zip = '', country = '' } = {}) => {
  const address = [street, city, state, zip, country].filter((item) => item).join(', ');

  return address ? `${address}` : '';
};
