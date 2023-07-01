import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import { Resume } from '../Types/Resume';
import styled from 'styled-components';
import HashMatrix, { HashMatrixPathPartType } from '../System/ValueProcessing/HashMatrix';

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
  align-items: flex-start;
  font-size: 18pt;
  line-height: 1em;
  font-weight: bold;
`;
const Quad = styled.div`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 4fr;
  font-size: 9pt;
`;
const QuadName = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  text-align: right;
  padding: 0.5em;
  border-right: 0.05em solid black;
  border-bottom: 0.05em solid black;
`;
const NameEmphasized = styled.div`
  font-weight: bold;
  font-size: 12pt;
  margin-bottom: -0.1em;
`;
const QuadDate = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 0.5em;
  border-bottom: 0.05em solid black;
`;
const DateYear = styled.div`
  font-size: 24pt;
  line-height: 1em;
`;
const QuadDetails = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: flex-start;
  padding: 0.5em;
  border-right: 0.05em solid black;
`;
const QuadSkills = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.5em;
`;
const References = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 9pt;
`;

const getFormattedDate = (isoDateString: string): ReactNode => {
  const date = new Date(`${isoDateString}T12:00:00.000Z`);
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();

  return (
    <>
      <DateYear>{year}</DateYear>
      <div>{month}</div>
      <div>{day}</div>
    </>
  );
};

export type ResumeDisplayProps = {
  resume: Resume;
  zoomScale?: number;
};

export const ResumeDisplay: FC<ResumeDisplayProps> = ({
  // TOSO: Stuff.
  resume = {} as Resume,
  zoomScale = 1,
}) => {
  const r = useMemo(() => new HashMatrix({ hashMatrix: resume, pathDelimiter: '/' }), [resume]);
  const getValue = useCallback(
    (path: HashMatrixPathPartType, fallbackValue?: any) => r.getPath(path) ?? fallbackValue,
    [r]
  );

  return (
    <ResumeDisplayBase>
      <ResumeDocument $zoomScale={zoomScale}>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <CenterBody>
          <Title>{getValue('objective')}</Title>
          <Quad>
            <QuadName>
              <NameEmphasized>
                {getValue('subject/name/first')}&nbsp;
                {getValue('subject/name/middle')}
                {getValue('subject/name/middle') && <>&nbsp;</>}
                {getValue('subject/name/last')}
              </NameEmphasized>
              {getValue('subject/email')}
              <br />
              {getValue('subject/phone')}
            </QuadName>
            <QuadDate>{getFormattedDate(getValue('date'))}</QuadDate>
            <QuadDetails>Details</QuadDetails>
            <QuadSkills>Skills</QuadSkills>
          </Quad>
          <References>{getValue('references').toString()}</References>
        </CenterBody>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
      </ResumeDocument>
    </ResumeDisplayBase>
  );
};
