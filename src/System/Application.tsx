import React, { FC, useCallback, useMemo } from 'react';
import { getTypeStructureByPath, TypeStructureMap } from './TypeParsing/TypeUtils';
import { TypeStructureComponent } from './TypeStructureComponent';
import HashMatrix from './ValueProcessing/HashMatrix';
import { List } from './List';
import { NavigationBreadcrumb, NavigationBreadcrumbs, useNavigation } from './Navigation';
import styled from 'styled-components';

const ApplicationBase = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  gap: 1em;
  overflow: hidden;
`;
const HeaderBase = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  gap: 1em;
`;

export type ApplicationProps<TypeStructureMapType extends TypeStructureMap> = {
  typeStructureMap: TypeStructureMapType;
  value: any;
  entryType: keyof TypeStructureMapType;
  onChange: (value: any) => void;
};

export const Application: FC<ApplicationProps<any>> = ({ typeStructureMap, value, entryType, onChange }) => {
  const typeStructure = useMemo(() => typeStructureMap[entryType], [typeStructureMap, entryType]);
  const { trail, path, onNavigateTo, onNavigateBack, onSetTrail } = useNavigation();
  const hashMatrix = useMemo(
    () =>
      new HashMatrix({
        hashMatrix: value,
      }),
    [value]
  );
  const currentValue = useMemo(() => hashMatrix.getPath(path.map((p) => `${p}`)), [hashMatrix, path]);
  const currentTypeStructure = useMemo(
    () => getTypeStructureByPath(path, typeStructure, typeStructureMap),
    [path, typeStructure, typeStructureMap]
  );
  const { multiple: currentTypeIsMultiple = false } = currentTypeStructure;
  const currentValueIsItemInList = useMemo(() => {
    const { isListItem = false }: Partial<NavigationBreadcrumb> = trail[trail.length - 1] || {};

    return isListItem;
  }, [trail]);
  const onChangeInternal = useCallback(
    (name: string, value: any) => {
      const stringNav = path.map((p) => `${p}`);

      hashMatrix.setPath(!!name ? [...stringNav, name] : stringNav, value);
      onChange(hashMatrix.getValue());
    },
    [hashMatrix, path, onChange]
  );
  const onListChange = useCallback(
    (value: any) => {
      hashMatrix.setPath(
        path.map((p) => `${p}`),
        value
      );
      onChange(hashMatrix.getValue());
    },
    [hashMatrix, path, onChange]
  );

  return (
    <ApplicationBase>
      {trail.length > 0 ? (
        <HeaderBase>
          <NavigationBreadcrumbs trail={trail} onChange={onSetTrail} />
        </HeaderBase>
      ) : undefined}
      {currentTypeIsMultiple && !currentValueIsItemInList ? (
        <List
          typeStructure={currentTypeStructure}
          typeStructureMap={typeStructureMap}
          items={currentValue}
          onChange={onListChange}
          onNavigateToPath={onNavigateTo}
          onNavigateBack={onNavigateBack}
        />
      ) : (
        <TypeStructureComponent
          typeStructureMap={typeStructureMap}
          typeStructure={currentTypeStructure}
          value={currentValue}
          onChange={onChangeInternal}
          onNavigateToPath={onNavigateTo}
          onNavigateBack={onNavigateBack}
          topLevel
          isEntryPoint={trail.length === 0}
        />
      )}
    </ApplicationBase>
  );
};
