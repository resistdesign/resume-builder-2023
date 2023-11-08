import { FC } from 'react';

export type ComponentMap = Record<string, FC>;

const convertLayoutToCSS = (
  layout: string = ''
): {
  areas: string[];
  css: string;
} => {
  const lines = layout.split('\n');

  let areaRows: string[] = [];
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
        areaRows = [...areaRows, parts[0]];

        if (parts[1]) {
          rows = [...rows, parts[1]];
        }
      }
    }
  }

  css += `\ngrid-template-areas:\n${areaRows
    .filter((a) => !!(a && a.trim()))
    .map((a) => `  "${a}"`)
    .join('\n')};`;

  if (rows.length) {
    css += `\ngrid-template-rows: ${rows.filter((r) => !!(r && r.trim())).join(' ')};`;
  }

  const areas: string[] = areaRows.reduce(
    (acc, a) => [
      ...acc,
      ...a
        .split(' ')
        .map((a) => a && a.trim())
        .filter((a) => !!a),
    ],
    [] as string[]
  );

  return {
    areas,
    css,
  };
};

export const getLayoutComponents = (layout: TemplateStringsArray): ComponentMap => {
  let compMap: ComponentMap = {};
  const { areas, css } = convertLayoutToCSS(layout.join('')) as any;

  return {
    ...compMap,
    areas,
    css,
  };
};
