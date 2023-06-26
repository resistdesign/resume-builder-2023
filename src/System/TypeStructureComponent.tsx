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
}

export type TypeStructureComponentProps = {
  typeStructureMap: TypeStructureMap;
  typeStructure: TypeStructure;
  value: any;
  onChange: (name: string, value: any) => void;
};

export const TypeStructureComponent: FC<TypeStructureComponentProps> = ({
  typeStructureMap,
  typeStructure,
  value,
  onChange,
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
  } = useMemo(() => {
    const { contentNames } = typeStructure;

    return getTypeStructureWithFilteredContent(contentNames, typeStructure);
  }, [typeStructureMap, typeStructure]);
  const inputType = TYPE_TO_INPUT_TYPE_MAP[typeStructureType];
  const {
    [TAG_TYPES.label]: { value: typeStructureLabel = undefined } = {},
    // TODO: Consider layout.
    [TAG_TYPES.layout]: { value: typeStructureLayout = undefined } = {},
  } = typeStructureTags;
  const [internalValue, setInternalValue] = useState(value);
  const onPropertyChange = useCallback(
    (n: string, v: any) => {
      setInternalValue({
        ...internalValue,
        [n]: v,
      });
    },
    [internalValue, setInternalValue]
  );
  const onFormSubmit = useCallback(() => {
    onChange(typeStructureName, internalValue);
  }, [typeStructureName, internalValue]);

  if (isForm) {
    // TODO: Submit buttons???
    // TODO: Reset buttons???
    return (
      <Form key={typeStructureName} onSubmit={onFormSubmit}>
        {typeStructureContent.map((tS) => {
          const { name: tSName, tags: tSTags = {}, literal: tSLiteral = false } = tS;
          const { [TAG_TYPES.inline]: { value: tSInline = undefined } = {} } = tSTags;
          // TODO: Handle opening arrays as Lists.

          if (tSLiteral || tSInline) {
            return (
              <TypeStructureComponent
                key={tSName}
                typeStructureMap={typeStructureMap}
                typeStructure={tS}
                value={value?.[tSName]}
                onChange={onPropertyChange}
              />
            );
          } else {
            // TODO: Open a sub-form.
            return <button>Open Form</button>;
          }
        })}
      </Form>
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
