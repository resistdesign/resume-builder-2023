import '@picocss/pico';
import './Assets/Fonts/readex-pro/stylesheet.css';
import React, { FC, useCallback, useEffect, useState } from 'react';
import TSM from '././Meta/TypeStructureMap.json';
import { Application } from './System/Application';
import styled, { createGlobalStyle } from 'styled-components';
import { getLocalJSON, LocalJSON } from './System/Storage/LocalJSON';
import { TypeStructureMap } from './System/TypeParsing/TypeUtils';
import { LayoutBox } from './System/Layout';
import { fileOpen, fileSave } from 'browser-fs-access';
import { ResumeDisplay } from './Resume/ResumeDisplay';
// @ts-ignore
import Logo from 'url:./Assets/Images/Trans Zap Logo.png';

const LogoImage = styled.img`
  flex: 0 0 auto;
  height: 3em;
  border-radius: var(--border-radius);
`;

const TYPE_STRUCTURE_MAP: TypeStructureMap = TSM as any;
const RESUME_ENTRY_TYPE_NAME = 'Resume';
const RESUME_ITEM_PREFIX = 'Resume';
const MAIN_RESUME_ITEM = 'Default';
const RESUME_SERVICE: LocalJSON = getLocalJSON(RESUME_ITEM_PREFIX);
const DEFAULT_RESUME = RESUME_SERVICE.read(MAIN_RESUME_ITEM) || {};
const MODE_PREFIX = 'Mode';
const MAIN_MODE = 'Default';
const MODE_SERVICE: LocalJSON = getLocalJSON(MODE_PREFIX);
const DEFAULT_MODE = MODE_SERVICE.read(MAIN_MODE) || false;
const ZOOM_PREFIX = 'Zoom';
const MAIN_ZOOM = 'Default';
const ZOOM_SERVICE: LocalJSON = getLocalJSON(ZOOM_PREFIX);
const DEFAULT_ZOOM = ZOOM_SERVICE.read(MAIN_ZOOM) ?? 1;

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

  @media print {
    display: none;
  }
`;
const TopControlButton = styled.button`
  flex: 1 0 auto;

  @media screen and (max-width: 768px) {
    padding: 0.5em;
  }
`;
const TopControlButtonIcon = styled.svg`
  width: 1em;
  height: 1em;
  margin: 0.25em;
`;
const TopControlButtonLabel = styled.span`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const PrintLayoutBox = styled(LayoutBox)`
  flex: 1 1 auto;
  overflow: hidden;
`;

export const App: FC = () => {
  const [printing, setPrinting] = useState(DEFAULT_MODE);
  const [zoomScale, setZoomScale] = useState(DEFAULT_ZOOM);
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const onSelectBuildMode = useCallback(() => {
    setPrinting(false);
  }, []);
  const onSelectPrintMode = useCallback(() => {
    setPrinting(true);
  }, []);
  const onImportFile = useCallback(async () => {
    try {
      const file = await fileOpen({
        mimeTypes: ['application/json'],
        extensions: ['.rdresume'],
      });
      const json = await file.text();
      const res = JSON.parse(json);

      setResume(res);
    } catch (e) {
      // Ignore.
    }
  }, [setResume]);
  const onExportFile = useCallback(async () => {
    try {
      const json = JSON.stringify(resume, null, 2);
      const jsonBlob = new Blob([json], { type: 'application/json' });

      await fileSave(jsonBlob, {
        fileName: 'Resume.rdresume',
        extensions: ['.rdresume'],
      });
    } catch (e) {
      // Ignore.
    }
  }, [resume]);
  const onZoomScaleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setZoomScale(parseFloat(`${event.target.value}`));
    },
    [setZoomScale]
  );

  useEffect(() => {
    RESUME_SERVICE.update(MAIN_RESUME_ITEM, resume);
  }, [resume]);

  useEffect(() => {
    MODE_SERVICE.update(MAIN_MODE, printing);
  }, [printing]);

  useEffect(() => {
    ZOOM_SERVICE.update(MAIN_ZOOM, zoomScale);
  }, [zoomScale]);

  useEffect(() => {
    let metaKey = false;

    const handleMetaKeyDown = (event: KeyboardEvent) => {
      metaKey = metaKey || event.key === 'Meta';

      if ((event.ctrlKey || metaKey) && event.key === 's') {
        event.preventDefault();
        onExportFile();
      }
    };
    const handleMetaKeyUp = (event: KeyboardEvent) => {
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
        <LogoImage src={Logo} />
        <TopControlButton onClick={onImportFile}>
          <TopControlButtonIcon viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
            <path fill="white" d="M24 24H0L24 0z" />
          </TopControlButtonIcon>
          <TopControlButtonLabel>&nbsp;Import</TopControlButtonLabel>
        </TopControlButton>
        <TopControlButton onClick={onExportFile}>
          <TopControlButtonIcon viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
            <path fill="white" d="M24 0V24L0 0z" />
          </TopControlButtonIcon>
          <TopControlButtonLabel>&nbsp;Export</TopControlButtonLabel>
        </TopControlButton>
        <TopControlButton onClick={onSelectBuildMode}>Build</TopControlButton>
        <TopControlButton onClick={onSelectPrintMode}>Print</TopControlButton>
      </HeaderBox>
      {!printing ? (
        <Application
          typeStructureMap={TYPE_STRUCTURE_MAP}
          value={resume}
          entryType={RESUME_ENTRY_TYPE_NAME}
          onChange={setResume}
          keepNavigationHistory
        />
      ) : (
        <>
          <HeaderBox>
            <select value={zoomScale} onChange={onZoomScaleChange}>
              <option value={0.25}>25%</option>
              <option value={0.5}>50%</option>
              <option value={0.75}>75%</option>
              <option value={1}>100%</option>
              <option value={1.25}>125%</option>
              <option value={1.5}>150%</option>
              <option value={1.75}>175%</option>
              <option value={2}>200%</option>
            </select>
          </HeaderBox>
          <PrintLayoutBox $allowShrink>
            <PrintLayoutBox $allowShrink={false}>
              <ResumeDisplay resume={resume} zoomScale={zoomScale} />
            </PrintLayoutBox>
          </PrintLayoutBox>
        </>
      )}
    </AppBase>
  );
};
