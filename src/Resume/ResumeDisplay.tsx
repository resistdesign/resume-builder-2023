import styled, {css} from 'styled-components';
import { Display } from '../System/Display';

const DisplayResetCSS = css`
  display: block;
  flex-direction: unset;
  justify-content: unset;
  align-items: unset;
`;

export const ResumeDisplay = styled(Display)`
  display: grid;
  grid-template:
    'subject subject subject date'
    'subject subject subject date'
    'objective objective objective objective'
    'employment employment education education'
    'references references references references';
  gap: 1em;

  ${DisplayResetCSS}
  & div {
    ${DisplayResetCSS}
  }

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
