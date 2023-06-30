import React, { FC } from 'react';
import { Resume } from '../Types/Resume';
import styled from 'styled-components';

const ResumeDisplayBase = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
  overflow: auto;
  object-fit: contain;
`;
const ResumeDocument = styled.div<{ $zoomScale?: number }>`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: 1fr 5fr 1fr;
  border: 1px solid black;
  background-color: white;
  width: 8.5in;
  height: 11in;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.5);
  padding: 0;
  margin: auto;
  gap: 0;
  transform-origin: ${p => typeof p.$zoomScale === 'number' && p.$zoomScale > 1 ? 'top left' : 'center center'};
  transform: scale(${(p) => p.$zoomScale ?? 1});

  @media screen and (max-width: 768px) {
    transform-origin: top left;
  }

  & > div {
    border: 1px solid black;
  }
`;

export type ResumeDisplayProps = {
  resume: Resume;
  zoomScale?: number;
};

export const ResumeDisplay: FC<ResumeDisplayProps> = ({
  // TOSO: Stuff.
  resume = {} as Resume,
  zoomScale = 1,
}) => {
  return (
    <ResumeDisplayBase>
      <ResumeDocument $zoomScale={zoomScale}>
        <div>Header</div>
        <div>Header</div>
        <div>Header</div>
        <div>Body</div>
        <div>Body</div>
        <div>Body</div>
        <div>Footer</div>
        <div>Footer</div>
        <div>Footer</div>
      </ResumeDocument>
    </ResumeDisplayBase>
  );
};
