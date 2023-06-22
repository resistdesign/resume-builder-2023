import { ChangeEvent, FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { FormContextProvider, FormContextType, useFormContext } from './FormContext';

export type FormProps<ValueType extends Record<any, any>> = PropsWithChildren & {
  name: string;
  onSubmit?: (outerFormValue: Record<any, any>) => void;
};

export const Form: FC<FormProps<any>> = <ValueType extends Record<any, any>>({
  name,
  children,
  onSubmit,
}: FormProps<ValueType>) => {
  const outerFormContext = useFormContext();
  const { value: outerFormValue, onChange }: Partial<FormContextType<Record<any, any>>> = outerFormContext || {};
  const formValue = useMemo(() => outerFormValue?.[name], [outerFormValue, name]);
  const [internalValue, setInternalValue] = useState<Partial<ValueType>>(formValue || {});
  const onChangeInternal = useCallback(
    (newValue: Partial<ValueType>) => setInternalValue(newValue),
    [setInternalValue]
  );
  const formContext: FormContextType<Partial<ValueType>> = useMemo(() => {
    return {
      value: internalValue,
      onChange: onChangeInternal,
    };
  }, [internalValue, onChangeInternal]);
  const onSubmitInternal = useCallback(
    (event: ChangeEvent<HTMLFormElement>) => {
      const newOuterFormValue = {
        ...outerFormValue,
        [name]: internalValue,
      };

      event.preventDefault();

      if (onSubmit) {
        onSubmit(newOuterFormValue);
      } else if (onChange) {
        onChange(newOuterFormValue);
      }
    },
    [onSubmit, onChange, name, outerFormValue, internalValue]
  );

  return (
    <FormContextProvider value={formContext}>
      <form onSubmit={onSubmitInternal}>{children}</form>
    </FormContextProvider>
  );
};
