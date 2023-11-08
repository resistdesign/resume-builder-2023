import { FC } from 'react';
import styled from 'styled-components';

export type ComponentMap = Record<string, FC>;

export type LayoutComponents = {
  layout: FC;
  areas: ComponentMap;
};

const getPascalCaseAreaName = (area: string): string => {
  return area
    .split('-')
    .map((a) => a[0].toUpperCase() + a.slice(1))
    .join('');
};

const convertLayoutToCSS = (
  layout: string = ''
): {
  areasList: string[];
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

  const areasList: string[] = Object.keys(
    areaRows
      .reduce(
        (acc, a) => [
          ...acc,
          ...a
            .split(' ')
            .map((a) => a && a.trim())
            .filter((a) => !!a),
        ],
        [] as string[]
      )
      .reduce((acc, a) => ({ ...acc, [a]: true }), {})
  );

  return {
    areasList,
    css,
  };
};

export const getLayoutComponents = (layoutTemplate: TemplateStringsArray): LayoutComponents => {
  const { areasList, css } = convertLayoutToCSS(layoutTemplate.join(''));
  const layout = styled.div`
    ${css}
  `;
  const areas: ComponentMap = areasList.reduce((acc, area) => {
    const pascalCaseAreaName = getPascalCaseAreaName(area);
    const component = styled.div`
      grid-area: ${area};
    `;

    return {
      ...acc,
      [pascalCaseAreaName]: component,
    };
  }, {} as ComponentMap);

  return {
    layout,
    areas,
  };
};
