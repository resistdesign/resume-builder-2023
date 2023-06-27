import React, { FC, PropsWithChildren, useMemo, useState } from 'react';
import { getTypeStructureByPath, TypeStructureMap } from './TypeParsing/TypeUtils';
import { TypeStructureComponent } from './TypeStructureComponent';
import HashMatrix from './ValueProcessing/HashMatrix';

export type NavigationPath = (string | number)[];

export type ApplicationProps<TypeStructureMapType extends TypeStructureMap> = PropsWithChildren & {
  typeStructureMap: TypeStructureMapType;
  value: any;
  entryType: keyof TypeStructureMapType;
  onChange: (value: any) => void;
};

export const Application: FC<ApplicationProps<any>> = ({ typeStructureMap, value, entryType, onChange, children }) => {
  const typeStructure = useMemo(() => typeStructureMap[entryType], [typeStructureMap, entryType]);
  const [nav, setNav] = useState<NavigationPath>([]);
  const hashMatrix = useMemo(() => new HashMatrix(value), [value]);
  const currentValue = useMemo(() => hashMatrix.getPath(nav.map((p) => `${p}`)), [hashMatrix, nav]);
  const currentTypeStructure = useMemo(
    () => getTypeStructureByPath(nav, typeStructure, typeStructureMap),
    [nav, typeStructure, typeStructureMap]
  );

  return (
    <TypeStructureComponent
      typeStructureMap={typeStructureMap}
      typeStructure={currentTypeStructure}
      value={currentValue}
      onChange={onChangeInternal}
    />
  );
};
