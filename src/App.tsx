import '@picocss/pico/css/pico.min.css';
import React, { FC, useEffect, useState } from 'react';
import TSM from '././Meta/TypeStructureMap.json';
import { Application } from './System/Application';
import styled, { createGlobalStyle } from 'styled-components';
import { getLocalJSON, LocalJSON } from './System/Storage/LocalJSON';

const RESUME_ITEM_PREFIX = 'Resume';
const MAIN_RESUME_ITEM = 'Default';
const RESUME_SERVICE: LocalJSON = getLocalJSON(RESUME_ITEM_PREFIX);
const DEFAULT_RESUME = RESUME_SERVICE.read(MAIN_RESUME_ITEM) || {};

const GlobalStyle: FC = createGlobalStyle`
  input,
  label,
  button {
    margin-bottom: 0;
  }

  input[type="checkbox"] {
    margin-bottom: -0.5em;
  }
` as any;

// TODO: i18n.
// TODO: Printing.
// TODO: Form titles and sub-sections.

const AppBase = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  gap: 1em;

  width: 100vw;
  height: 100vh;
  
  overflow: hidden;
`;
const HeaderBox = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  gap: 1em;
`;

export const App: FC = () => {
  const [resume, setResume] = useState(DEFAULT_RESUME);

  useEffect(() => {
    RESUME_SERVICE.update(MAIN_RESUME_ITEM, resume);
  }, [resume]);

  return (
    <AppBase>
      <GlobalStyle />
      <HeaderBox>
        <button>Select</button>
        <button>Build</button>
        <button>Print</button>
      </HeaderBox>
      <Application typeStructureMap={TSM} value={resume} entryType="Resume" onChange={setResume} />
    </AppBase>
  );
};
