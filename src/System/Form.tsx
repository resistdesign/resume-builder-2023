import { ChangeEvent, FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { FormContextProvider, FormContextType } from './FormContext';

export type FormProps<ValueType extends Record<any, any>> = PropsWithChildren & {
  name: string;
  value?: ValueType;
  onSubmit?: (name: string, value: ValueType) => void;
};

export const Form: FC<FormProps<any>> = <ValueType extends Record<any, any>>({
  name,
  value,
  onSubmit,
  children,
}: FormProps<ValueType>) => {
  const [internalValue, setInternalValue] = useState<ValueType>(value || ({} as ValueType));
  const onChangeInternal = useCallback((newValue: ValueType) => setInternalValue(newValue), [setInternalValue]);
  const formContext: FormContextType<ValueType> = useMemo(() => {
    return {
      value: internalValue,
      onChange: onChangeInternal,
    };
  }, [internalValue, onChangeInternal]);
  const onSubmitInternal = useCallback(
    (event: ChangeEvent<HTMLFormElement>) => {
      if (onSubmit) {
        const { target } = event;
        const { value: newValue } = target;

        event.preventDefault();
        onSubmit(name, newValue);
      }
    },
    [onSubmit, name]
  );

  return (
    <FormContextProvider value={formContext}>
      <form onSubmit={onSubmitInternal}>{children}</form>
    </FormContextProvider>
  );
};
