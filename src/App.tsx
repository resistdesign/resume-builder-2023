import '@picocss/pico/css/pico.min.css';
import React, { FC, useState } from 'react';
import TSM from '././Meta/TypeStructureMap.json';
import { Application } from './System/Application';

// TODO: i18n.

export const App: FC = () => {
  const [resume, setResume] = useState({});

  return <Application typeStructureMap={TSM} value={resume} entryType="Resume" onChange={setResume} />;
};
