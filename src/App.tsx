import '@picocss/pico/css/pico.min.css';
import React, { FC, useCallback, useEffect, useState } from 'react';
import TSM from '././Meta/TypeStructureMap.json';
import { Application } from './System/Application';
import styled, { createGlobalStyle } from 'styled-components';
import { getLocalJSON, LocalJSON } from './System/Storage/LocalJSON';
import { Display } from './System/Display';
import { getTypeStructureByName } from './System/TypeParsing/TypeUtils';

const RESUME_ENTRY_TYPE_NAME = 'Resume';
const RESUME_ITEM_PREFIX = 'Resume';
const MAIN_RESUME_ITEM = 'Default';
const RESUME_SERVICE: LocalJSON = getLocalJSON(RESUME_ITEM_PREFIX);
const DEFAULT_RESUME = RESUME_SERVICE.read(MAIN_RESUME_ITEM) || {};

const GlobalStyle: FC = createGlobalStyle`
  body {
    overflow: hidden;
  }

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
  height: 100%;

  box-sizing: border-box;
  padding: 1em;

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
  const [printing, setPrinting] = useState(false);
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const onSelectBuildMode = useCallback(() => {
    setPrinting(false);
  }, []);
  const onSelectPrintMode = useCallback(() => {
    setPrinting(true);
  }, []);

  useEffect(() => {
    RESUME_SERVICE.update(MAIN_RESUME_ITEM, resume);
  }, [resume]);

  return (
    <AppBase>
      <GlobalStyle />
      <HeaderBox>
        <button onClick={onSelectBuildMode}>Build</button>
        <button onClick={onSelectPrintMode}>Print</button>
      </HeaderBox>
      {!printing ? (
        <Application typeStructureMap={TSM} value={resume} entryType={RESUME_ENTRY_TYPE_NAME} onChange={setResume} />
      ) : (
        <Display
          typeStructure={getTypeStructureByName(RESUME_ENTRY_TYPE_NAME, TSM)}
          typeStructureMap={TSM}
          value={resume}
        />
      )}
    </AppBase>
  );
};
