import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import {TypeStructure, TypeStructureMap} from "./TypeParsing/TypeUtils";

export type FormProps =  {
  name: string;
  value: Record<any, any>;
  onSubmit: (name: string, newValue: any) => void;
  typeStructure: TypeStructure;
  typeStructureMap: TypeStructureMap;
};

export const Form: FC<FormProps> = ({
  name,
  value,
  onSubmit,
    typeStructure,
    typeStructureMap,
}: FormProps) => {
  const [internalValue, setInternalValue] = useState(value || {});
  const onSubmitInternal = useCallback(
    (event: ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();

      onSubmit(name, internalValue);
    },
    [onSubmit, name, value, internalValue]
  );

  return (
      <form onSubmit={onSubmitInternal}>

      </form>
  );
};
