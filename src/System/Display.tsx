import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import {
  getCleanTypeStructure,
  getTypeStructureIsPrimitive,
  TypeStructure,
  TypeStructureMap,
} from './TypeParsing/TypeUtils';

const DisplayObjectBase = styled.div``;
const DisplayArrayBase = styled.div``;
const DisplayPrimitiveBase = styled.div``;

type DisplayProps = {
  typeStructure: TypeStructure;
  typeStructureMap: TypeStructureMap;
  value: any;
  isItem?: boolean;
};

export const DisplayObject: FC<DisplayProps> = ({ typeStructure, typeStructureMap, value = {} }) => {
  const { content = [] } = typeStructure;

  return (
    <DisplayObjectBase>
      {content.map((item: any, index: number) => {
        const { name } = item;

        return <Display key={index} typeStructure={item} typeStructureMap={typeStructureMap} value={value[name]} />;
      })}
    </DisplayObjectBase>
  );
};

export const DisplayArray: FC<DisplayProps> = ({ typeStructure, typeStructureMap, value = [] }) => {
  return (
    <DisplayArrayBase>
      {value.map((item: any, index: number) => (
        <Display key={index} typeStructure={typeStructure} typeStructureMap={typeStructureMap} value={item} isItem />
      ))}
    </DisplayArrayBase>
  );
};

export const DisplayPrimitive: FC<DisplayProps> = ({ typeStructure, typeStructureMap, value }) => {
  return <DisplayPrimitiveBase>{value}</DisplayPrimitiveBase>;
};

export const Display: FC<DisplayProps> = ({ typeStructure, typeStructureMap, value, isItem = false }) => {
  const cleanTypeStructure = useMemo(() => getCleanTypeStructure(typeStructure), [typeStructure]);
  const { multiple = false } = cleanTypeStructure;
  const typeStructureIsPrimitive = useMemo(() => getTypeStructureIsPrimitive(cleanTypeStructure), [cleanTypeStructure]);

  return multiple && !isItem ? (
    <DisplayArray typeStructure={cleanTypeStructure} typeStructureMap={typeStructureMap} value={value} />
  ) : typeStructureIsPrimitive ? (
    <DisplayPrimitive typeStructure={cleanTypeStructure} typeStructureMap={typeStructureMap} value={value} />
  ) : (
    <DisplayObject typeStructure={cleanTypeStructure} typeStructureMap={typeStructureMap} value={value} />
  );
};
