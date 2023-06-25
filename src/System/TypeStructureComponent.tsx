import React, { FC, useCallback, useMemo } from 'react';
import { getTypeStructureByName, getTypeStructureWithFilteredContent, TypeStructureMap } from './TypeParsing/TypeUtils';
import { Input } from './Input';
import { Form } from './Form';

export const TYPE_TO_INPUT_TYPE_MAP: Record<string, string> = {
  string: 'text',
  number: 'number',
  boolean: 'checkbox',
  Date: 'date',
  any: 'text',
  object: 'text',
  array: 'text',
};

export enum TAG_TYPES {
  label = 'label',
  inline = 'inline',
  layout = 'layout',
}

export type TypeStructureComponentProps = {
  typeStructureMap: TypeStructureMap;
  typeStructureTypeName: string;
  name: string;
  value: any;
  onChange: (name: string, value: any) => void;
};

export const TypeStructureComponent: FC<TypeStructureComponentProps> = ({
  typeStructureMap,
  typeStructureTypeName,
  name,
  value,
  onChange,
}) => {
  const {
    name: typeStructureName,
    type: typeStructureType,
    multiple: typeStructureMultiple,
    tags: typeStructureTags = {},
    content: typeStructureContent = [],
    literal: typeStructureLiteral,
  } = useMemo(() => {
    const tS = getTypeStructureByName(typeStructureTypeName, typeStructureMap);
    const { contentNames } = tS;

    return getTypeStructureWithFilteredContent(contentNames, tS);
  }, [typeStructureMap, typeStructureTypeName]);
  const inputType = TYPE_TO_INPUT_TYPE_MAP[typeStructureType];
  const {
    [TAG_TYPES.inline]: { value: typeStructureInline = undefined } = {},
    [TAG_TYPES.label]: { value: typeStructureLabel = undefined } = {},
    // TODO: Consider layout.
    [TAG_TYPES.layout]: { value: typeStructureLayout = undefined } = {},
  } = typeStructureTags;
  const onFormSubmit = useCallback(() => {
    // TODO: Call `onChange` with `internalValue`.
  }, []);

  if (typeStructureMultiple) {
    // TODO: Need a list component.
    // TODO: Link to a list
  } else {
    if (typeStructureLiteral) {
      return (
        <Input
          key={typeStructureName}
          name={name}
          label={`${typeStructureLabel ?? ''}`}
          value={value}
          type={inputType}
          onChange={onChange}
        />
      );
    } else if (typeStructureInline) {
      return <Form onSubmit={onFormSubmit}>{/* TODO: Insert TypeStructureComponents */}</Form>;
    } else {
      // TODO: Need link to new form.
    }
  }
};
