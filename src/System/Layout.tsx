export const FORM_CONTROLS_GRID_AREA = 'FORM_CONTROLS_GRID_AREA';

export const getTypeStructureLayoutGridTemplate = (
  typeStructureLayout: string = '',
  topLevel: boolean = false
): string => {
  const hasTemplate = !!typeStructureLayout.replace(/\s/g, () => '');

  if (hasTemplate) {
    const gridTemplateRows = typeStructureLayout
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => !!l);
    const maxColCount = gridTemplateRows.reduce((acc, row) => {
      const colCount = row.split(' ').length;

      return Math.max(acc, colCount);
    }, 1);
    const rowsWithControls = topLevel ? [...gridTemplateRows, FORM_CONTROLS_GRID_AREA] : gridTemplateRows;
    const filledGridTemplateRows = rowsWithControls.map((row) => {
      const existingCols = row.split(' ');
      const colCount = existingCols.length;
      const ratio = maxColCount / colCount;

      return existingCols
        .reduce((acc: string[], c: string, ind: number) => {
          const intRatio = ind === existingCols.length - 1 ? Math.ceil(ratio) : Math.floor(ratio);
          const newCols = new Array(intRatio).fill(c);

          return [...acc, ...newCols];
        }, [])
        .join(' ');
    });

    return filledGridTemplateRows.map((l) => `"${l}"`).join('\n');
  } else {
    return '';
  }
};
