import React, {FC, useMemo} from 'react';
import { Resume } from '../Types/Resume';
import styled from 'styled-components';
import HashMatrix from "../System/ValueProcessing/HashMatrix";

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
  transform-origin: ${(p) => (typeof p.$zoomScale === 'number' && p.$zoomScale > 1 ? 'top left' : 'center center')};
  transform: scale(${(p) => p.$zoomScale ?? 1});
  
  color: black;

  @media screen and (max-width: 768px) {
    transform-origin: top left;
  }
`;
const CenterBody = styled.div`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 3fr 1fr;
`;
const Title = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  font-size: 48pt;
`;
const Quad = styled.div`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 4fr;
`;
const References = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
    justify-content: flex-start;
    align-items: center;
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
  const r = useMemo(() => new HashMatrix({hashMatrix: resume}), [resume]);

  return (
    <ResumeDisplayBase>
      <ResumeDocument $zoomScale={zoomScale}>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <CenterBody>
            <Title>{r.getPath('objective')}</Title>
            <Quad>
                <div>Name</div>
                <div>Date</div>
                <div>Details</div>
                <div>Skills</div>
            </Quad>
            <References>{r.getPath('references')}</References>
        </CenterBody>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
      </ResumeDocument>
    </ResumeDisplayBase>
  );
};
