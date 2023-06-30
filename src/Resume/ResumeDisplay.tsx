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

  & .display-primitive-date {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
  }

  & .display-object-name {
    display: grid;
    grid-template: 'first middle last';
  }

  & .display-object-references,
  & > .display-object-subject {
    display: grid;
    grid-template:
      'name name name address'
      'description description description address'
      'phone phone email email'
      'socialNetworks socialNetworks socialNetworks socialNetworks';
    gap: 1em;
  }

  & .display-object-address {
    display: grid;
    grid-template:
      'line1 line1 line1'
      'line2 line2 line2'
      'city state zip'
      'country country country';
  }
`;
