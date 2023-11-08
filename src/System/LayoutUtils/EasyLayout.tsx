import { FC } from 'react';

export type ComponentMap = Record<string, FC>;

export const convertLayoutToCSS = (layout: string = ''): string => {
  const lines = layout.split('\n');
  const areas = [];
  const rows = [];

  let css = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (i === lines.length - 1) {
      // Column Widths
      css += `\ngrid-template-columns: ${line};`;
    } else {
      const parts = line.split(',');

      areas.push(parts[0]);
      rows.push(parts[1]);
    }
  }

  css += `\ngrid-template-areas: ${areas.filter((a) => !!(a && a.trim())).join(' ')};`;
  css += `\ngrid-template-rows: ${rows.filter((r) => !!(r && r.trim())).join(' ')};`;

  return css;
};

// TODO: const getLayoutAreas = (layout: string = ''): string[] => {};

export const getLayoutComponents = (layout: string = ''): ComponentMap => {
  let compMap: ComponentMap = {};

  return compMap;
};
