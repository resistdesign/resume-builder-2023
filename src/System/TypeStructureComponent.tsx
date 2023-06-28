import React, { FC, useCallback, useMemo, useState } from 'react';
import { getTypeStructureWithFilteredContent, TypeStructure, TypeStructureMap } from './TypeParsing/TypeUtils';
import { Input } from './Input';
import { Form } from './Form';

const FORM_CONTROLS_GRID_AREA = 'FORM_CONTROLS_GRID_AREA';

export const TYPE_TO_INPUT_TYPE_MAP: Record<string, string> = {
  string: 'text',
  number: 'number',
  boolean: 'checkbox',
  Date: 'date',
  any: 'text',
};

export enum TAG_TYPES {
  label = 'label',
  inline = 'inline',
  layout = 'layout',
  itemName = 'itemName',
}

type OpenFormButtonProps = {
  name: string;
  label: string;
  onOpenForm: (name: string) => void;
};

const OpenFormButton: FC<OpenFormButtonProps> = ({ name, label, onOpenForm }) => {
  const onOpenFormInternal = useCallback(() => {
    onOpenForm(name);
  }, [name, onOpenForm]);

  return (
    <button type="button" onClick={onOpenFormInternal}>
      Edit {label}
    </button>
  );
};

export type TypeStructureComponentProps = {
  typeStructureMap: TypeStructureMap;
  typeStructure: TypeStructure;
  value: any;
  onChange: (name: string, value: any) => void;
  onNavigateToPath: (path: string[]) => void;
  navigationPathPrefix?: string[];
  topLevel?: boolean;
};

export const TypeStructureComponent: FC<TypeStructureComponentProps> = ({
  typeStructureMap,
  typeStructure,
  value,
  onChange,
  onNavigateToPath,
  navigationPathPrefix = [],
  topLevel = false,
}) => {
  const isForm = useMemo(() => {
    const { content = [] } = typeStructure;

    return content.length > 0;
  }, [typeStructure]);
  const {
    name: typeStructureName = '',
    type: typeStructureType,
    tags: typeStructureTags = {},
    content: typeStructureContent = [],
    literal: typeStructureLiteral = false,
  } = useMemo(() => {
    const { contentNames } = typeStructure;

    return getTypeStructureWithFilteredContent(contentNames, typeStructure);
  }, [typeStructure]);
  const inputType = TYPE_TO_INPUT_TYPE_MAP[typeStructureType];
  const {
    [TAG_TYPES.label]: { value: typeStructureLabel = undefined } = {},
    [TAG_TYPES.inline]: { value: typeStructureInline = undefined } = {},
    [TAG_TYPES.layout]: { value: typeStructureLayout = undefined } = {},
  } = typeStructureTags;
  const isMainForm = useMemo(
    () => (!typeStructureInline && !typeStructureLiteral) || topLevel,
    [typeStructureInline, typeStructureLiteral, topLevel]
  );
  const formStyle = useMemo(() => {
    const baseStye = {
      flex: '1 0 auto',
      gridArea: !topLevel ? typeStructureName : undefined,
    };

    if (typeof typeStructureLayout === 'string') {
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

        return existingCols.reduce((acc, c, ind) => {
          const intRatio = ind === existingCols.length - 1 ? Math.ceil(ratio) : Math.floor(ratio);
          const newCols = new Array(intRatio).fill(c);

          return [...acc, ...newCols];
        }, []);
      });

      return {
        ...baseStye,
        display: 'grid',
        gridTemplate: filledGridTemplateRows.map((l) => `"${l}"`).join('\n'),
      };
    } else {
      return baseStye;
    }
  }, [typeStructureLayout, typeStructureName, topLevel]);
  const [internalValue, setInternalValue] = useState(value);
  const submissionTypeName = useMemo(() => {
    return topLevel ? '' : typeStructureName;
  }, [topLevel, typeStructureName]);
  const onFormSubmit = useCallback(() => {
    onChange(submissionTypeName, internalValue);
  }, [topLevel, submissionTypeName, internalValue]);
  const onPropertyChange = useCallback(
    (n: string, v: any) => {
      const newValue = {
        ...internalValue,
        [n]: v,
      };

      setInternalValue(newValue);

      if (!isMainForm) {
        onChange(submissionTypeName, newValue);
      }
    },
    [internalValue, setInternalValue, isMainForm, onChange, submissionTypeName]
  );
  const onNavigateToPathInternal = useCallback(
    (path: string[] = []) => {
      onNavigateToPath([...navigationPathPrefix, ...path]);
    },
    [onNavigateToPath, navigationPathPrefix]
  );
  const onOpenForm = useCallback(
    (name: string) => {
      onNavigateToPathInternal([name]);
    },
    [onNavigateToPathInternal]
  );
  const FormComp = isMainForm ? Form : 'div';
  const formProps = useMemo(() => {
    return isMainForm ? { onSubmit: onFormSubmit } : {};
  }, [isMainForm, onFormSubmit]);

  console.log(formStyle);

  if (isForm) {
    return (
      <FormComp key={typeStructureName} style={formStyle} {...(formProps as any)}>
        {typeStructureContent.map((tS) => {
          const { name: tSName, tags: tSTags = {}, literal: tSLiteral = false } = tS;
          const {
            [TAG_TYPES.inline]: { value: tSInline = false } = {},
            [TAG_TYPES.label]: { value: tSLabel = tSName } = {},
          } = tSTags;
          const inputLabel = typeof tSLabel === 'string' ? tSLabel : tSName;

          if (tSLiteral || tSInline) {
            return (
              <TypeStructureComponent
                key={tSName}
                typeStructureMap={typeStructureMap}
                typeStructure={tS}
                value={internalValue?.[tSName]}
                onChange={onPropertyChange}
                onNavigateToPath={onNavigateToPathInternal}
                navigationPathPrefix={[tSName]}
              />
            );
          } else {
            return <OpenFormButton key={tSName} name={tSName} label={inputLabel} onOpenForm={onOpenForm} />;
          }
        })}
        {isMainForm ? (
          <div
            style={{
              gridArea: FORM_CONTROLS_GRID_AREA,
            }}
          >
            <button type="reset">Reset</button>
            <button type="submit">Submit</button>
          </div>
        ) : undefined}
      </FormComp>
    );
  } else {
    return (
      <Input
        key={typeStructureName}
        name={typeStructureName}
        label={`${typeStructureLabel ?? ''}`}
        value={value}
        type={inputType}
        onChange={onChange}
      />
    );
  }
};
