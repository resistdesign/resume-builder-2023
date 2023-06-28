import React, { FC, useCallback, useMemo, useState } from 'react';
import { getTypeStructureWithFilteredContent, TypeStructure, TypeStructureMap } from './TypeParsing/TypeUtils';
import { Input } from './Input';
import { Form } from './Form';

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
  const formStyle = useMemo(
    () =>
      typeof typeStructureLayout === 'string'
        ? {
            flex: '1 0 auto',
            display: 'grid',
            gridTemplate: typeStructureLayout,
          }
        : undefined,
    [typeStructureLayout]
  );
  const [internalValue, setInternalValue] = useState(value);
  const onFormSubmit = useCallback(() => {
    onChange(typeStructureName, internalValue);
  }, [typeStructureName, internalValue]);
  const onPropertyChange = useCallback(
    (n: string, v: any) => {
      const newValue = {
        ...internalValue,
        [n]: v,
      };

      setInternalValue(newValue);

      if (!isMainForm) {
        onChange(typeStructureName, newValue);
      }
    },
    [internalValue, setInternalValue, isMainForm, onChange, typeStructureName]
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
          <div>
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
