import React, { FC } from 'react';
import styled from 'styled-components';
import { Resume } from '../../Types/Resume';

export const ResumeBase = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1.125in);
  grid-auto-rows: 1.125in;
  gap: 0.25in;
  padding: 0.25in;
  width: 8.5in;
  background-color: white;
`;
export const DemoPanel = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  background-color: lightgray;
  border-radius: 0.5em;
  padding: 0.25in;
`;
export const Header = styled(DemoPanel)`
  grid-column: 1 / 7;
  grid-row: 1 / 2;
  background-color: red;
`;
export const DisplayArea = styled(DemoPanel)`
  grid-column: 1 / 5;
  grid-row: 2 / 9;
  background-color: yellow;
`;
export const SideArea = styled(DemoPanel)`
  grid-column: 5 / 7;
  grid-row: 2 / 9;
  background-color: lime;
`;

export type ResumeProps = {
  resume?: Resume;
};

export const ResumeLayout: FC<ResumeProps> = ({ resume = {} as Resume }) => {
  return (
    <ResumeBase>
      <Header>Header</Header>
      <DisplayArea>Display Area</DisplayArea>
      <SideArea>Side Area</SideArea>
    </ResumeBase>
  );
};