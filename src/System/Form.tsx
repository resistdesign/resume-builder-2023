import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { getTypeStructureByName, TypeStructure, TypeStructureMap } from './TypeParsing/TypeUtils';

export type FormProps = {
  name: string;
  value: Record<any, any>;
  onSubmit: (name: string, newValue: any) => void;
  typeStructureName: string;
  typeStructureMap: TypeStructureMap;
};

export const Form: FC<FormProps> = ({ name, value, onSubmit, typeStructureName, typeStructureMap }) => {
  const typeStructure = useMemo<TypeStructure>(
    () => getTypeStructureByName(typeStructureName, typeStructureMap),
    [typeStructureName, typeStructureMap]
  );
  const [internalValue, setInternalValue] = useState(value || {});
  const onPropertyChange = useCallback(
    (propertyName: string, newValue: any) => {
      setInternalValue({ ...internalValue, [propertyName]: newValue });
    },
    [internalValue, setInternalValue]
  );
  const onSubmitInternal = useCallback(
    (event: ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();

      onSubmit(name, internalValue);
    },
    [onSubmit, name, value, internalValue]
  );

  return <form onSubmit={onSubmitInternal}></form>;
};
