import { Resume } from '../../Types/Resume';
import { Person } from '../../Types/Person';
import { mdPerson } from './Person';

// TODO: Remaining info.

export const mdResume = (
  {
    date = '',
    subject = {} as Person,
    objective = '',
    skills = [],
    employment = [],
    education = [],
    references = [],
  }: Resume = {} as Resume
) => `
${mdPerson(subject)}
${date}

${objective}

${references.map((r) => mdPerson(r)).join('\n')}
`;
