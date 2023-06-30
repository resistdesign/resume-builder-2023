import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import {
  getTypeStructureByPath,
  getTypeStructureIsPrimitive,
  TypeStructure,
  TypeStructureMap,
} from './TypeParsing/TypeUtils';

const DisplayBase = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1em;
  padding: 1rem;
`;
const DisplayObjectBase = styled(DisplayBase)``;
const DisplayArrayBase = styled(DisplayBase)``;
const DisplayPrimitiveBase = styled(DisplayBase)``;

type DisplayProps = {
  typeStructure: TypeStructure;
  typeStructureMap: TypeStructureMap;
  value: any;
  isItem?: boolean;
};

export const DisplayObject: FC<DisplayProps> = ({ typeStructure, typeStructureMap, value = {} }) => {
  const { name = '', content = [] } = typeStructure;

  return (
    <DisplayObjectBase className={`display-object-${name}`}>
      {content.map((item: any, index: number) => {
        const { name } = item;

        return <Display key={index} typeStructure={item} typeStructureMap={typeStructureMap} value={value[name]} />;
      })}
    </DisplayObjectBase>
  );
};

export const DisplayArray: FC<DisplayProps> = ({ typeStructure, typeStructureMap, value = [] }) => {
  const { name = '' } = typeStructure;

  return (
    <DisplayArrayBase className={`display-array-${name}`}>
      {value.map((item: any, index: number) => (
        <Display key={index} typeStructure={typeStructure} typeStructureMap={typeStructureMap} value={item} isItem />
      ))}
    </DisplayArrayBase>
  );
};

export const DisplayPrimitive: FC<DisplayProps> = ({ typeStructure, typeStructureMap, value }) => {
  const { name = '' } = typeStructure;

  return <DisplayPrimitiveBase className={`display-primitive-${name}`}>{value}</DisplayPrimitiveBase>;
};

export const Display: FC<DisplayProps> = ({ typeStructure, typeStructureMap, value, isItem = false }) => {
  const cleanTypeStructure = useMemo(() => {
    const { name } = typeStructure;

    return getTypeStructureByPath([name], typeStructure, typeStructureMap);
  }, [typeStructure]);
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
