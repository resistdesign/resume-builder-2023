import React, { FC } from 'react';
import styled from 'styled-components';
import { Resume } from '../../Types/Resume';

export const ResumeBase = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(8, 1fr);
  grid-column-gap: 16px;
  grid-row-gap: 16px;
`;

export type ResumeProps = {
  resume?: Resume;
};

export const ResumeLayout: FC<ResumeProps> = ({ resume = {} as Resume }) => {
  return <ResumeBase></ResumeBase>;
};
