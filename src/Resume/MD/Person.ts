import { Person } from '../../Types/Person';
import { mdAddress } from './Address';

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

${description}

${phone ? `${phone}` : ''}
${email ? `${email}` : ''}

${socialNetworks.map(({ name, url }) => `${name ? name + ': ' : ''}${url ? url : ''}`).join('\n')}

${address ? `${mdAddress(address)}` : ''}
`;
