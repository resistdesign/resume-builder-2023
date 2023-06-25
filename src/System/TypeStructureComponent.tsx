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
  const {
    name: typeStructureName = '',
    type: typeStructureType,
    multiple: typeStructureMultiple,
    tags: typeStructureTags = {},
    content: typeStructureContent = [],
    literal: typeStructureLiteral,
  } = useMemo(() => {
    const { contentNames } = typeStructure;

    return getTypeStructureWithFilteredContent(contentNames, typeStructure);
  }, [typeStructureMap, typeStructure]);
  const inputType = TYPE_TO_INPUT_TYPE_MAP[typeStructureType];
  const {
    [TAG_TYPES.inline]: { value: typeStructureInline = undefined } = {},
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

  if (typeStructureMultiple) {
    // TODO: Need a list component.
    // TODO: Link to a list.
  } else {
    if (typeStructureLiteral) {
      // TODO: Literal Forms.
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
    } else if (typeStructureInline) {
      // TODO: Submit buttons???
      return (
        <Form key={typeStructureName} onSubmit={onFormSubmit}>
          {typeStructureContent.map((tS) => {
            const { name: tSName = '' } = tS;

            return (
              <TypeStructureComponent
                key={tSName}
                typeStructureMap={typeStructureMap}
                typeStructure={tS}
                value={value?.[tSName]}
                onChange={onPropertyChange}
              />
            );
          })}
        </Form>
      );
    } else {
      // TODO: Need link to new form.
    }
  }
};
