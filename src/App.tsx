import '@picocss/pico/css/pico.min.css';
import React, { FC, useCallback, useEffect, useState } from 'react';
import TSM from '././Meta/TypeStructureMap.json';
import { Application } from './System/Application';
import styled, { createGlobalStyle } from 'styled-components';
import { getLocalJSON, LocalJSON } from './System/Storage/LocalJSON';
import { Display } from './System/Display';
import { getTypeStructureByName, TypeStructureMap } from './System/TypeParsing/TypeUtils';
import { LayoutBox } from './System/Layout';

const TYPE_STRUCTURE_MAP: TypeStructureMap = TSM as any;
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
const FileButton = styled.button``;

export const App: FC = () => {
  const [printing, setPrinting] = useState(false);
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const onSelectBuildMode = useCallback(() => {
    setPrinting(false);
  }, []);
  const onSelectPrintMode = useCallback(() => {
    setPrinting(true);
  }, []);
  const onImportFile = useCallback(async () => {
    // @ts-ignore
    const [newHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Resume File',
          accept: { 'application/json': ['.rdresume'] },
        },
      ],
    });
    const file = await newHandle.getFile();
    const json = await file.text();

    setResume(JSON.parse(json));
  }, [setResume]);
  const onExportFile = useCallback(async () => {
    // @ts-ignore
    const newHandle = await window.showSaveFilePicker({
      suggestedName: 'Resume.rdresume',
      types: [
        {
          description: 'Resume File',
          accept: { 'application/json': ['.rdresume'] },
        },
      ],
    });
    const writableStream = await newHandle.createWritable();
    await writableStream.write(JSON.stringify(resume));
    await writableStream.close();
  }, [resume]);

  useEffect(() => {
    RESUME_SERVICE.update(MAIN_RESUME_ITEM, resume);
  }, [resume]);

  useEffect(() => {
    let metaKey = false;

    const handleMetaKeyDown = (event: KeyboardEvent) => {
      metaKey = metaKey || event.key === 'Meta';
    };
    const handleMetaKeyUp = (event: KeyboardEvent) => {
      if ((event.ctrlKey || metaKey) && event.key === 's') {
        event.preventDefault();
        onExportFile();
      }

      metaKey = event.key === 'Meta' ? false : metaKey;
    };

    window.addEventListener('keydown', handleMetaKeyDown);
    window.addEventListener('keyup', handleMetaKeyUp);

    return () => {
      window.removeEventListener('keydown', handleMetaKeyDown);
      window.removeEventListener('keyup', handleMetaKeyUp);
    };
  }, [onExportFile]);

  return (
    <AppBase>
      <GlobalStyle />
      <HeaderBox>
        <FileButton onClick={onImportFile}>Import</FileButton>
        <FileButton onClick={onExportFile}>Export</FileButton>
        <button onClick={onSelectBuildMode}>Build</button>
        <button onClick={onSelectPrintMode}>Print</button>
      </HeaderBox>
      {!printing ? (
        <Application
          typeStructureMap={TYPE_STRUCTURE_MAP}
          value={resume}
          entryType={RESUME_ENTRY_TYPE_NAME}
          onChange={setResume}
        />
      ) : (
        <LayoutBox $allowShrink>
          <LayoutBox $allowShrink={false}>
            <Display
              typeStructure={getTypeStructureByName(RESUME_ENTRY_TYPE_NAME, TYPE_STRUCTURE_MAP)}
              typeStructureMap={TYPE_STRUCTURE_MAP}
              value={resume}
            />
          </LayoutBox>
        </LayoutBox>
      )}
    </AppBase>
  );
};
