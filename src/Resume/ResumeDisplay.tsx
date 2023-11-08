import React, { FC } from 'react';
import { Resume } from '../Types/Resume';
import styled from 'styled-components';
import { getLayoutComponents } from '../System/LayoutUtils/EasyLayout';

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
  const month = monthAsNumber
    ? date.getMonth() + 1
    : date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();

  return { year, month, day };
};

const ResumeDisplayBase = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: auto;
`;

export type ResumeDisplayProps = {
  resume?: Resume;
};

const {
  layout: Layout,
  areas: { Header, Side, Body, Footer },
} = getLayoutComponents(
  ResumeDisplayBase,
  styled.div`
    background-color: blue;
  `
)`
header header, 2fr
side body, 5fr
footer footer, 1fr
\\ 1fr 6fr
`;
const {
  layout: BodyLayout,
  areas: { BodyTop, BodyMiddle, BodyBottom },
} = getLayoutComponents(
  styled(Body)`
    gap: 1em;
  `,
  styled.div`
    background-color: red;
  `
)`
body-top, 1fr
body-middle, 3fr
body-bottom, 1fr
\\ 1fr
`;
const {
  layout: BodyMiddleLayout,
  areas: { BodyMiddleLeft, BodyMiddleCenter, BodyMiddleRight },
} = getLayoutComponents(
  styled(BodyMiddle)`
    gap: 1em;
  `,
  styled.div`
    background-color: green;
  `
)`
body-middle-left body-middle-center body-middle-right, 1fr
\\ 1fr 3fr 1fr
`;

export const ResumeDisplay: FC<ResumeDisplayProps> = ({ resume = {} as Resume }) => {
  return (
    <Layout>
      <Header>Header</Header>
      <Side>Side</Side>
      <BodyLayout>
        <BodyTop>Body Top</BodyTop>
        <BodyMiddleLayout>
          <BodyMiddleLeft>Body Middle Left</BodyMiddleLeft>
          <BodyMiddleCenter>Body Middle Center</BodyMiddleCenter>
          <BodyMiddleRight>Body Middle Right</BodyMiddleRight>
        </BodyMiddleLayout>
        <BodyBottom>Body Bottom</BodyBottom>
      </BodyLayout>
      <Footer>Footer</Footer>
    </Layout>
  );
};
