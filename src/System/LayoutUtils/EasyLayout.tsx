import { FC } from 'react';

export type ComponentMap = Record<string, FC>;

export const convertLayoutToCSS = (layout: string = ''): string => {
  const lines = layout.split('\n');

  let areas: string[] = [];
  let rows: string[] = [];
  let css = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.indexOf('\\') === 0) {
      // Column Widths
      css += `\ngrid-template-columns: ${line.split('\\').join('').trim()};`;
    } else {
      const parts = line.split(',').map((p) => p && p.trim());

      if (parts[0]) {
        areas = [...areas, parts[0]];

        if (parts[1]) {
          rows = [...rows, parts[1]];
        }
      }
    }
  }

  css += `\ngrid-template-areas:\n${areas
    .filter((a) => !!(a && a.trim()))
    .map((a) => `  "${a}"`)
    .join('\n')};`;

  if (rows.length) {
    css += `\ngrid-template-rows: ${rows.filter((r) => !!(r && r.trim())).join(' ')};`;
  }

  return css;
};

// TODO: const getLayoutAreas = (layout: string = ''): string[] => {};

export const getLayoutComponents = (layout: string = ''): ComponentMap => {
  let compMap: ComponentMap = {};

  return compMap;
};
