import React, { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { TypeStructure, TypeStructureMap } from './TypeParsing/TypeUtils';
import { TypeStructureComponent } from './TypeStructureComponent';

export type NavigationItem = {
  value: any;
  typeStructure: TypeStructure;
  // TODO: Handle showing Lists.
  multiple?: boolean;
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
  const { value: currentValue, typeStructure: currentTypeStructure } = useMemo(() => nav[nav.length - 1], [nav]);
  const onNavTo = useCallback(
    (navItem: NavigationItem) => {
      setNav([...nav, navItem]);
    },
    [nav]
  );
  const onNavBack = useCallback(() => {
    setNav(nav.slice(0, nav.length - 1));
  }, [nav]);
  const onChangeInternal = useCallback(
    (v: any) => {
      onChange(v);
    },
    [onChange]
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
