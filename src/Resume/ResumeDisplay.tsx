import React, { FC, Fragment, useCallback, useMemo } from 'react';
import { Resume } from '../Types/Resume';
import styled from 'styled-components';
import HashMatrix, { HashMatrixPathPartType } from '../System/ValueProcessing/HashMatrix';
import { Person } from '../Types/Person';
import { Skill } from '../Types/Skill';
import { SocialNetwork } from '../Types/SocialNetwork';
import { Education } from '../Types/Education';

type FormattedDateParts = {
  year: string | number;
  month: string | number;
  day: number;
};

const padNumber = (num: number, pad: number = 2): string => {
  let str = num.toString();
  while (str.length < pad) {
    str = '0' + str;
  }

  return str;
};

const getFormattedDateParts = (
  isoDateString: string,
  monthAsNumber: boolean = false,
  shortYear: boolean = false
): FormattedDateParts => {
  const date = new Date(`${isoDateString}T12:00:00.000Z`);
  const year = shortYear ? padNumber(date.getFullYear() % 100) : date.getFullYear();
  const month = monthAsNumber ? date.getMonth() + 1 : date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();

  return { year, month, day };
};

const ResumeDisplayBase = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
  overflow: auto;
  object-fit: contain;

  @media print {
    overflow: hidden;
  }
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
  overflow: hidden;

  color: black;
  font-family: 'readex_proregular', sans-serif;

  @media screen and (max-width: 768px) {
    transform-origin: top left;
  }

  @media print {
    border: none;
    box-shadow: none;
    background-color: unset;
    margin: -1em;
  }
`;
const CenterBody = styled.div`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 5fr 2fr;
`;
const Title = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 18pt;
  line-height: 1.2em;
  font-weight: bold;

  white-space: pre-wrap;
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
  border-right: 0.05em dashed grey;
  border-bottom: 0.05em solid grey;
`;
const NameEmphasized = styled.div`
  font-weight: bold;
  font-size: 16pt;
  line-height: 1em;
`;
const NameEmphasizedSmall = styled(NameEmphasized)`
  font-size: 9pt;
`;
const QuadDate = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 0.5em;
  border-bottom: 0.05em solid grey;
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
  border-right: 0.05em dashed grey;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
  flex-wrap: wrap;
  font-size: 7pt;
  padding: 2em 0 0 0;
`;
const FormattedReferenceBase = styled.div`
  flex: 0 0 auto;
  margin-bottom: 2em;
  border-left: 0.05em solid grey;
  padding-left: 1em;
  margin-right: 1em;
`;
const GridCellHolder = styled.div`
  flex: 0 0 auto;
`;
const SideBox = styled.div`
  font-size: 7pt;
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.5em;
`;
const SideBoxItem = styled.div`
  margin-bottom: 1em;
`;
const SideBoxTitle = styled.div`
  font-weight: bold;
  font-size: 9pt;
  line-height: 1em;
  white-space: nowrap;
`;
const SideBoxCaption = styled.div`
  font-size: 6pt;
  line-height: 1em;
`;

type FormattedDateProps = {
  isoDateString: string;
};

const FormattedDate: FC<FormattedDateProps> = ({ isoDateString }) => {
  const { year, month, day } = useMemo(() => getFormattedDateParts(isoDateString), [isoDateString]);

  return (
    <>
      <DateYear>{year}</DateYear>
      <div>{month}</div>
      <div>{day}</div>
    </>
  );
};

type FormattedEducationProps = {
  education: Education;
};

const FormattedEducation: FC<FormattedEducationProps> = ({ education }) => {
  const {
    establishment = '',
    startDate = '',
    endDate = '',
    program = '',
    credentialType = '',
    achievements = [],
  } = education;
  const { month: startMonth, year: startYear } = useMemo(
    () => getFormattedDateParts(startDate as string, true, true),
    [startDate]
  );
  const { month: endMonth, year: endYear } = useMemo(
    () => getFormattedDateParts(endDate as string, true, true),
    [endDate]
  );

  return (
    <SideBoxItem>
      <SideBoxTitle>
        {establishment}&nbsp;&nbsp;{startMonth}/{startYear}-{endMonth}/{endYear}
      </SideBoxTitle>
      <div>
        {program}&nbsp;&nbsp;{credentialType}
      </div>
      <div>
        {achievements.map((achievement, index) => (
          <SideBoxCaption key={index}>{achievement}</SideBoxCaption>
        ))}
      </div>
    </SideBoxItem>
  );
};

type FormattedReferenceProps = {
  reference: Person;
};

const FormattedReference: FC<FormattedReferenceProps> = ({ reference }) => {
  const {
    name: { first: firstName = '', middle: middleName = '', last: lastName = '' } = {} as any,
    description,
    email = '',
    phone = '',
    address: { city = '', state = '', country = '' } = {} as any,
    socialNetworks = [],
  } = reference;

  return (
    <FormattedReferenceBase>
      <NameEmphasizedSmall>
        {firstName}&nbsp;{middleName}
        {middleName ? <>&nbsp;</> : undefined}
        {lastName}
      </NameEmphasizedSmall>
      <div>{description}</div>
      <div>
        <a href={`mailto:${email}`}>{email}</a>
      </div>
      <div>
        <a href={`tel:${phone}`}>{phone}</a>
      </div>
      <div>
        {city},&nbsp;{state}&nbsp;{country}
      </div>
      <div>
        {socialNetworks.map(({ name, url }, ind) => (
          <div key={ind}>
            <a href={url} target="_blank">
              {name}
            </a>
          </div>
        ))}
      </div>
    </FormattedReferenceBase>
  );
};

type FormattedSocialNetworkProps = {
  socialNetwork: SocialNetwork;
};

const FormattedSocialNetwork: FC<FormattedSocialNetworkProps> = ({ socialNetwork }) => {
  const { name = '', url = '' } = socialNetwork;

  return (
    <div>
      <a href={url} target="_blank">
        {name}
      </a>
    </div>
  );
};

type FormattedSkillProps = {
  skill: Skill;
};

const FormattedSkill: FC<FormattedSkillProps> = ({ skill }) => {
  const { description, rating = 0 } = skill;

  return (
    <div>
      <div>{description}</div>
      <div>{new Array(parseInt(`${rating}`, 10) || 0).fill('★').join(' ')}</div>
    </div>
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
    <ReturnType extends any = any>(path: HashMatrixPathPartType, fallbackValue?: any): ReturnType =>
      r.getPath(path) ?? fallbackValue,
    [r]
  );

  return (
    <ResumeDisplayBase>
      <ResumeDocument $zoomScale={zoomScale}>
        <GridCellHolder>&nbsp;</GridCellHolder>
        <GridCellHolder>&nbsp;</GridCellHolder>
        <GridCellHolder>&nbsp;</GridCellHolder>
        <GridCellHolder>&nbsp;</GridCellHolder>
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
              <div>
                <a href={`mailto:${getValue('subject/email')}`}>{getValue('subject/email')}</a>
              </div>
              <div>
                <a href={`tel:${getValue('subject/phone')}`}>{getValue('subject/phone')}</a>
              </div>
            </QuadName>
            <QuadDate>
              <FormattedDate isoDateString={getValue('date')} />
            </QuadDate>
            <QuadDetails>Employment Area...</QuadDetails>
            <QuadSkills>
              <SideBox>
                {getValue<SocialNetwork[]>('subject/socialNetworks', []).map((soc, ind) => (
                  <FormattedSocialNetwork key={ind} socialNetwork={soc} />
                ))}
              </SideBox>
              <br />
              <SideBox>
                {getValue<Education[]>('education', []).map((education, ind) => (
                  <FormattedEducation key={ind} education={education} />
                ))}
              </SideBox>
              <br />
              <SideBox>
                {getValue<Skill[]>('skills', []).map((skill, ind) => (
                  <FormattedSkill key={ind} skill={skill} />
                ))}
              </SideBox>
            </QuadSkills>
          </Quad>
          <GridCellHolder>
            <References>
              {getValue<Person[]>('references', []).map((reference, ind) => (
                <Fragment key={ind}>
                  <FormattedReference reference={reference} />
                </Fragment>
              ))}
            </References>
          </GridCellHolder>
        </CenterBody>
        <GridCellHolder>&nbsp;</GridCellHolder>
        <GridCellHolder>&nbsp;</GridCellHolder>
        <GridCellHolder>&nbsp;</GridCellHolder>
        <GridCellHolder>&nbsp;</GridCellHolder>
      </ResumeDocument>
    </ResumeDisplayBase>
  );
};
