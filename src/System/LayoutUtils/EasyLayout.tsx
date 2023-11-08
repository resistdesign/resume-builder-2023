import { FC, PropsWithChildren } from 'react';
import styled, { IStyledComponent } from 'styled-components';

export type FCWithChildren = FC<PropsWithChildren>;

export type ComponentMap = Record<string, FCWithChildren>;

export type LayoutComponents = {
  layout: FCWithChildren;
  areas: ComponentMap;
};

function isComponent(x: any): x is FCWithChildren | IStyledComponent<any, any> {
  return (
    typeof x === 'function' ||
    (typeof x === 'object' &&
      x !== null &&
      ('propTypes' in x ||
        'contextTypes' in x ||
        'defaultProps' in x ||
        'displayName' in x ||
        'styledComponentId' in x))
  );
}

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

export type GetLayoutComponentsLayoutTemplateArgument = TemplateStringsArray | FCWithChildren;
export type GetLayoutComponentsBaseSignature = (
  layoutTemplate: TemplateStringsArray
) => LayoutComponents;
export type GetLayoutComponentsReturnType<LayoutTempType> =
  LayoutTempType extends TemplateStringsArray ? LayoutComponents : GetLayoutComponentsBaseSignature;
export type GetLayoutComponentsSignature = <
  LayoutTempType extends GetLayoutComponentsLayoutTemplateArgument
>(
  layoutTemplate: LayoutTempType
) => GetLayoutComponentsReturnType<LayoutTempType>;

const getLayoutComponentsWithExtend = (
  layoutTemplate: TemplateStringsArray,
  extendFrom?: FCWithChildren
): LayoutComponents => {
  const { areasList, css } = convertLayoutToCSS(layoutTemplate.join(''));
  const layout = styled.div`
    display: grid;
    ${css}
  `;
  const areas: ComponentMap = areasList.reduce((acc, area) => {
    const pascalCaseAreaName = getPascalCaseAreaName(area);
    const baseCompFunc = extendFrom ? styled(extendFrom) : styled.div;
    const component = baseCompFunc`
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

export const getLayoutComponents: GetLayoutComponentsSignature = (layoutTemplate) => {
  if (isComponent(layoutTemplate)) {
    return ((lT: TemplateStringsArray) => {
      return getLayoutComponentsWithExtend(lT, layoutTemplate);
    }) as any;
  } else {
    return getLayoutComponentsWithExtend(layoutTemplate);
  }
};
