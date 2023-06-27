import React, { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
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
  const onChangeInternal = useCallback(
    (name: string, value: any) => {
      hashMatrix.setPath(
        nav.map((p) => `${p}`),
        value
      );
      onChange(hashMatrix.getValue());
    },
    [hashMatrix, nav, onChange]
  );
  const onNavToPath = useCallback(
    (path: NavigationPath) => {
      // TODO: Navigating back needs to remove entire path chunks that are added at once.
      setNav([...nav, ...path]);
    },
    [nav, setNav]
  );
  const onNavBack = useCallback(() => {
    setNav(nav.slice(0, nav.length - 1));
  }, [nav, setNav]);
  // TODO: Handle opening arrays as Lists.

  return (
    <TypeStructureComponent
      typeStructureMap={typeStructureMap}
      typeStructure={currentTypeStructure}
      value={currentValue}
      onChange={onChangeInternal}
      onNavigateToPath={onNavToPath}
    />
  );
};
