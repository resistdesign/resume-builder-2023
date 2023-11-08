import { FC } from 'react';

export type ComponentMap = Record<string, FC>;

const convertLayoutToCSS = (layout: string = ''): string => {
  const lines = layout.split('\n');

  let css = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const areas = [];
    const rows = [];

    if (i === lines.length - 1) {
      // Column Widths
      css += `grid-template-columns: ${line};`;
    } else {
      const parts = line.split(',');

      areas.push(parts[0]);
      rows.push(parts[1]);
    }

    css += `grid-template-areas: ${areas.filter((a) => !!(a && a.trim())).join(' ')};`;
    css += `grid-template-rows: ${rows.filter((r) => !!(r && r.trim())).join(' ')};`;
  }

  return css;
};

const getLayoutAreas = (layout: string = ''): string[] => {};

export const getLayoutComponents = (layout: string = ''): ComponentMap => {
  let compMap: ComponentMap = {};

  const;

  return;
  compMap;
};
