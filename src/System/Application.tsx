import React, { FC, useCallback, useMemo, useState } from 'react';
import { getTypeStructureByPath, TypeStructureMap } from './TypeParsing/TypeUtils';
import { TypeStructureComponent } from './TypeStructureComponent';
import HashMatrix from './ValueProcessing/HashMatrix';
import { List } from './List';

export type NavigationPath = (string | number)[];

export type ApplicationProps<TypeStructureMapType extends TypeStructureMap> = {
  typeStructureMap: TypeStructureMapType;
  value: any;
  entryType: keyof TypeStructureMapType;
  onChange: (value: any) => void;
};

export const Application: FC<ApplicationProps<any>> = ({ typeStructureMap, value, entryType, onChange }) => {
  const typeStructure = useMemo(() => typeStructureMap[entryType], [typeStructureMap, entryType]);
  const [navCollection, setNavCollection] = useState<NavigationPath[]>([]);
  const nav = useMemo<NavigationPath>(
    () => navCollection.reduce((acc, navPathCluster) => [...acc, ...navPathCluster], [] as NavigationPath),
    [navCollection]
  );
  const hashMatrix = useMemo(
    () =>
      new HashMatrix({
        hashMatrix: value,
      }),
    [value]
  );
  const currentValue = useMemo(() => hashMatrix.getPath(nav.map((p) => `${p}`)), [hashMatrix, nav]);
  const currentTypeStructure = useMemo(
    () => getTypeStructureByPath(nav, typeStructure, typeStructureMap),
    [nav, typeStructure, typeStructureMap]
  );
  const { multiple: currentTypeIsMultiple = false } = currentTypeStructure;
  const onChangeInternal = useCallback(
    (name: string, value: any) => {
      const stringNav = nav.map((p) => `${p}`);

      hashMatrix.setPath(!!name ? [...stringNav, name] : stringNav, value);
      onChange(hashMatrix.getValue());
    },
    [hashMatrix, nav, onChange]
  );
  const onListChange = useCallback(
    (value: any) => {
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
  // TODO: Breadcrumbs.

  return currentTypeIsMultiple ? (
    <List
      typeStructure={currentTypeStructure}
      items={currentValue}
      onChange={onListChange}
      onNavigateToPath={onNavToPath}
    />
  ) : (
    <TypeStructureComponent
      typeStructureMap={typeStructureMap}
      typeStructure={currentTypeStructure}
      value={currentValue}
      onChange={onChangeInternal}
      onNavigateToPath={onNavToPath}
      topLevel
    />
  );
};
