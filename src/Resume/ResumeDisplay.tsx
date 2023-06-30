import styled from 'styled-components';
import { Display } from '../System/Display';

export const ResumeDisplay = styled(Display)`
  display: grid;
  grid-template:
   "subject subject subject date" auto
   "objective objective objective objective" auto
   "employment employment education education" auto
   "references references references references" auto;
  gap: 1em;

  border: 1px solid #ccc;

  & div {
    border: 1px solid #ccc;
  }
`;
