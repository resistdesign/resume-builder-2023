import { Person } from '../../Types/Person';

export const mdPerson = (
  {
    name: { first = '', middle = '', last = '' } = {} as Person['name'],
    description = '',
    phone = '',
    email = '',
    socialNetworks = [],
    address,
  }: Person = {} as Person
) => `
${first} ${middle ? middle + ' ' : ''}${last}
`;
