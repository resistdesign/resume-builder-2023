import React, { FC } from 'react';
import { Resume } from '../Types/Resume';

export type ResumeDisplayProps = {
  resume: Resume;
};

export const ResumeDisplay: FC<ResumeDisplayProps> = ({
  // TOSO: Stuff.
  resume = {} as Resume,
}) => {
  return <div>Resume</div>;
};
