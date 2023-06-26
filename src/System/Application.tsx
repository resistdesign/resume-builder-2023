import React, { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { TypeStructure, TypeStructureMap } from './TypeParsing/TypeUtils';

export type NavigationItem = {
  value: any;
  typeStructure: TypeStructure;
};

export type ApplicationProps<TypeStructureMapType extends TypeStructureMap> = PropsWithChildren & {
  typeStructureMap: TypeStructureMapType;
  value: any;
  entryType: keyof TypeStructureMapType;
  onChange: (value: any) => void;
};

export const Application: FC<ApplicationProps<any>> = ({ typeStructureMap, value, entryType, onChange, children }) => {
  const typeStructure = useMemo(() => typeStructureMap[entryType], [typeStructureMap, entryType]);
  const initialNavigationItem: NavigationItem = useMemo(() => ({ value, typeStructure }), [value, typeStructure]);
  const [nav, setNav] = useState<NavigationItem[]>([initialNavigationItem]);
  const currentNav = useMemo(() => nav[nav.length - 1], [nav]);
  const onNavTo = useCallback(
    (navItem: NavigationItem) => {
      setNav([...nav, navItem]);
    },
    [nav]
  );
  const onNavBack = useCallback(() => {
    setNav(nav.slice(0, nav.length - 1));
  }, [nav]);

  return <div>{children}</div>;
};
