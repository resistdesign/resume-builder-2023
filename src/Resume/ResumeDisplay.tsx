import styled from 'styled-components';
import { Display } from '../System/Display';

export const ResumeDisplay = styled(Display)`
  display: grid;
  grid-template:
    'subject subject subject date'
    'subject subject subject date'
    'objective objective objective objective'
    'employment employment education education'
    'references references references references';
  gap: 1em;

  & > .display-object-subject {
    display: grid;
    grid-template:
      'name name name address'
      'description description description address'
      'phone phone email email'
      'socialNetworks socialNetworks socialNetworks socialNetworks';
    gap: 1em;
  }
`;
