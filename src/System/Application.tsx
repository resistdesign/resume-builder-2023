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
  const [navCollection, setNavCollection] = useState<NavigationPath[]>([]);
  const nav = useMemo<NavigationPath>(
    () => navCollection.reduce((acc, navPathCluster) => [...acc, ...navPathCluster], [] as NavigationPath),
    [navCollection]
  );
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
      setNavCollection([...navCollection, path]);
    },
    [navCollection, setNavCollection]
  );
  const onNavBack = useCallback(() => {
    setNavCollection(navCollection.slice(0, -1));
  }, [navCollection, setNavCollection]);
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
