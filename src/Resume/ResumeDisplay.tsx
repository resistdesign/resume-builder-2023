import React, { FC } from 'react';
import { Resume } from '../Types/Resume';
import styled from 'styled-components';
import { ResumeLayout } from './Layout/ResumeLayout';
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
} = getLayoutComponents`
header header, 2fr
side body, 5fr
footer footer, 1fr
\\ 1fr 6fr
`;

export const ResumeDisplay: FC<ResumeDisplayProps> = ({ resume = {} as Resume }) => {
  return (
    <ResumeDisplayBase>
      <ResumeLayout resume={resume} />
      <Layout>
        <Header>Header</Header>
        <Side>Side</Side>
        <Body>Body</Body>
        <Footer>Footer</Footer>
      </Layout>
    </ResumeDisplayBase>
  );
};
