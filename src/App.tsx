import '@picocss/pico/css/pico.min.css';
import React, { FC, useEffect, useState } from 'react';
import TSM from '././Meta/TypeStructureMap.json';
import { Application } from './System/Application';
import { createGlobalStyle } from 'styled-components';
import { getLocalJSON, LocalJSON } from './System/Storage/LocalJSON';

const RESUME_ITEM_PREFIX = 'Resume';
const MAIN_RESUME_ITEM = 'Default';
const RESUME_SERVICE: LocalJSON = getLocalJSON('Resume');
const DEFAULT_RESUME = RESUME_SERVICE.read(MAIN_RESUME_ITEM) || {};

const GlobalStyle: FC = createGlobalStyle`
  html {
    margin: 1em;
  }
` as any;

// TODO: i18n.
// TODO: Printing.
// TODO: Form titles and sub-sections.

export const App: FC = () => {
  const [resume, setResume] = useState(DEFAULT_RESUME);

  useEffect(() => {
    RESUME_SERVICE.update(MAIN_RESUME_ITEM, resume);
  }, [resume]);

  return (
    <>
      <GlobalStyle />
      <Application typeStructureMap={TSM} value={resume} entryType="Resume" onChange={setResume} />
    </>
  );
};
