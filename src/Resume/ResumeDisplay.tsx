import styled, { css } from 'styled-components';
import { Display } from '../System/Display';

const DisplayResetCSS = css`
  display: block;
  flex-direction: unset;
  justify-content: unset;
  align-items: unset;
`;

export const ResumeDisplay = styled(Display)`
  ${DisplayResetCSS}

  display: grid;
  grid-template:
    'subject subject subject date'
    'subject subject subject date'
    'objective objective objective objective'
    'employment employment education education'
    'references references references references';
  gap: 1em;

  & div {
    ${DisplayResetCSS}
  }

  & .display-object-name {
    display: grid;
    grid-template: 'first middle last';
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
