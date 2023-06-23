import React, { FC, PropsWithChildren } from 'react';
import { TypeStructureMap } from './TypeParsing/TypeUtils';

export type ApplicationProps = PropsWithChildren & {
  typeStructureMap: TypeStructureMap;
  value: any;
  entryType: keyof typeStructureMap;
  onChange: (value: any) => void;
};

export const Application: FC<ApplicationProps> = ({ typeStructureMap, value, entryType, onChange, children }) => {
  return <div>{children}</div>;
};
