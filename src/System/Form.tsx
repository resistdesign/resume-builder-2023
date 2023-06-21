import { ChangeEvent, FC, PropsWithChildren, useCallback } from 'react';

export type FormProps<ValueType extends Record<any, any>> = PropsWithChildren & {
  name: string;
  value?: ValueType;
  onChange?: (name: string, value: ValueType) => void;
  onSubmit?: (name: string, value: ValueType) => void;
};

export const Form: FC<FormProps<any>> = <ValueType extends Record<any, any>>({
  name,
  value,
  onChange,
  onSubmit,
  children,
}: FormProps<ValueType>) => {
  const onChangeInternal = useCallback(
    (event: ChangeEvent<HTMLFormElement>) => {
      if (onChange) {
        const { target } = event;
        const { value: newValue } = target;

        onChange(name, newValue);
      }
    },
    [onChange, name]
  );
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
    <form onSubmit={onSubmitInternal}>
      {children}
    </form>
  );
};
