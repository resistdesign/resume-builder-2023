import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  getTagValues,
  getTypeStructureByName,
  getTypeStructureByPath,
  getTypeStructureWithFilteredContent,
  getValueLabel,
  TAG_TYPES,
  TypeStructure,
  TypeStructureMap,
} from './TypeParsing/TypeUtils';
import { Input } from './Input';
import { Form } from './Form';
import { NavigateBackHandler, NavigateToHandler } from './Navigation';
import HashMatrix from './ValueProcessing/HashMatrix';

const FORM_CONTROLS_GRID_AREA = 'FORM_CONTROLS_GRID_AREA';

export const TYPE_TO_INPUT_TYPE_MAP: Record<string, string> = {
  string: 'text',
  number: 'number',
  boolean: 'checkbox',
  Date: 'date',
  DateTime: 'datetime-local',
  any: 'text',
};

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
  onNavigateToPath?: NavigateToHandler;
  onNavigateBack?: NavigateBackHandler;
  navigationPathPrefix?: string[];
  topLevel?: boolean;
  isEntryPoint?: boolean;
};

export const TypeStructureComponent: FC<TypeStructureComponentProps> = ({
  typeStructureMap,
  typeStructure,
  value,
  onChange,
  onNavigateToPath,
  onNavigateBack,
  navigationPathPrefix = [],
  topLevel = false,
  isEntryPoint = false,
}) => {
  const baseTypeStructure = useMemo(() => {
    const { type: typeStructureType = '' } = typeStructure;
    const topLevelTypeStructure = getTypeStructureByName(typeStructureType, typeStructureMap);

    return { ...topLevelTypeStructure, ...typeStructure };
  }, [typeStructureMap, typeStructure]);
  const isForm = useMemo(() => {
    const { content = [] } = baseTypeStructure;

    return content.length > 0;
  }, [baseTypeStructure]);
  const cleanTypeStructure = useMemo(() => {
    const { contentNames } = baseTypeStructure;

    return getTypeStructureWithFilteredContent(contentNames, baseTypeStructure);
  }, [baseTypeStructure]);
  const {
    name: typeStructureName = '',
    type: typeStructureType,
    content: typeStructureContent = [],
    literal: typeStructureLiteral = false,
    readonly = false,
  } = cleanTypeStructure;
  const inputType = TYPE_TO_INPUT_TYPE_MAP[typeStructureType];
  const {
    [TAG_TYPES.label]: typeStructureLabel = undefined,
    [TAG_TYPES.inline]: typeStructureInline = undefined,
    [TAG_TYPES.layout]: typeStructureLayout = undefined,
    [TAG_TYPES.options]: typeStructureOptionsString = undefined,
    [TAG_TYPES.optionsType]: typeStructureOptionsTypeName = undefined,
    [TAG_TYPES.allowCustomValue]: typeStructureAllowCustomValue = undefined,
  } = useMemo(
    () =>
      getTagValues(
        [
          TAG_TYPES.label,
          TAG_TYPES.inline,
          TAG_TYPES.layout,
          TAG_TYPES.options,
          TAG_TYPES.optionsType,
          TAG_TYPES.allowCustomValue,
        ],
        cleanTypeStructure
      ),
    [cleanTypeStructure]
  );
  const typeStructureOptions = useMemo(() => {
    if (typeof typeStructureOptionsString === 'string') {
      return typeStructureOptionsString
        .split('\n')
        .map((l) => l.split(','))
        .flat()
        .map((l) => l.trim());
    } else {
      return typeStructureOptionsTypeName && typeof typeStructureOptionsTypeName === 'string'
        ? getTypeStructureByName(typeStructureOptionsTypeName, typeStructureMap)
        : undefined;
    }
  }, [typeStructureOptionsString, typeStructureOptionsTypeName, typeStructureMap]);
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

        return existingCols
          .reduce((acc: string[], c: string, ind: number) => {
            const intRatio = ind === existingCols.length - 1 ? Math.ceil(ratio) : Math.floor(ratio);
            const newCols = new Array(intRatio).fill(c);

            return [...acc, ...newCols];
          }, [])
          .join(' ');
      });

      return {
        ...baseStye,
        display: 'grid',
        gridTemplate: filledGridTemplateRows.map((l) => `"${l}"`).join('\n'),
        gap: '1em',
      };
    } else {
      return baseStye;
    }
  }, [typeStructureLayout, typeStructureName, topLevel]);
  const [internalValueBase, setInternalValue] = useState(value);
  const valueLastChanged = useMemo(() => new Date().getTime(), [value]);
  const internalValueLastChanged = useMemo(() => new Date().getTime(), [internalValueBase]);
  const internalValue = useMemo(
    () => (valueLastChanged > internalValueLastChanged ? value : internalValueBase),
    [value, internalValueBase, valueLastChanged, internalValueLastChanged]
  );
  const submissionTypeName = useMemo(() => {
    return topLevel ? '' : typeStructureName;
  }, [topLevel, typeStructureName]);
  const onFormSubmit = useCallback(() => {
    onChange(submissionTypeName, internalValue);

    if (onNavigateBack) {
      onNavigateBack();
    }
  }, [topLevel, submissionTypeName, internalValue, onNavigateBack]);
  const onResetForm = useCallback(() => {
    setInternalValue(value);
  }, [value]);
  const onCancelForm = useCallback(() => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  }, [onNavigateBack]);
  const onPropertyChange = useCallback(
    (n: string, v: any) => {
      const newValue = {
        ...internalValue,
        [n]: v,
      };

      setInternalValue(newValue);

      if (!isMainForm || isEntryPoint) {
        onChange(submissionTypeName, newValue);
      }
    },
    [internalValue, setInternalValue, isMainForm, isEntryPoint, onChange, submissionTypeName]
  );
  const onNavigateToPathInternal = useCallback(
    (path: string[] = []) => {
      if (onNavigateToPath) {
        const targetValue = new HashMatrix({ hashMatrix: internalValue }).getPath(path);
        const targetTypeStructure = getTypeStructureByPath(path, cleanTypeStructure, typeStructureMap);

        onNavigateToPath({
          label: getValueLabel(targetValue, targetTypeStructure, typeStructureMap),
          path: [...navigationPathPrefix, ...path],
        });
      }
    },
    [onNavigateToPath, navigationPathPrefix, internalValue, cleanTypeStructure, typeStructureMap]
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

  if (isForm) {
    return (
      <FormComp key={typeStructureName} style={formStyle} {...(formProps as any)}>
        {typeStructureContent.map((tS) => {
          const { name: tSName, literal: tSLiteral = false, type: tSType } = tS;
          const { [TAG_TYPES.inline]: tSInline, [TAG_TYPES.label]: tSLabel } = getTagValues(
            [TAG_TYPES.inline, TAG_TYPES.label],
            tS
          );
          const inputLabel = typeof tSLabel === 'string' ? tSLabel : tSName;
          const inpType = typeof tSType === 'string' ? TYPE_TO_INPUT_TYPE_MAP[tSType] : undefined;
          const tSTypeIsTypeStructure = typeof tSType === 'string' && !!typeStructureMap[tSType];
          const useInputType = inpType || !tSTypeIsTypeStructure;

          if (tSLiteral || tSInline || useInputType) {
            return (
              <TypeStructureComponent
                key={tSName}
                typeStructureMap={typeStructureMap}
                typeStructure={tS}
                value={internalValue?.[tSName]}
                onChange={onPropertyChange}
                onNavigateToPath={onNavigateToPath}
                navigationPathPrefix={[tSName]}
              />
            );
          } else {
            return <OpenFormButton key={tSName} name={tSName} label={inputLabel} onOpenForm={onOpenForm} />;
          }
        })}
        {isMainForm && !isEntryPoint ? (
          <div
            style={{
              gridArea: FORM_CONTROLS_GRID_AREA,
              flex: '1 0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1em',
            }}
          >
            <button
              style={{
                flex: '1 0 auto',
                width: 'auto',
              }}
              type="button"
              onClick={onCancelForm}
            >
              Cancel
            </button>
            <button
              style={{
                flex: '1 0 auto',
                width: 'auto',
              }}
              type="button"
              onClick={onResetForm}
            >
              Reset
            </button>
            <button
              style={{
                flex: '1 0 auto',
                width: 'auto',
              }}
              type="submit"
            >
              Submit
            </button>
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
        options={typeStructureOptions}
        allowCustomValue={!!typeStructureAllowCustomValue}
        readonly={readonly}
      />
    );
  }
};
