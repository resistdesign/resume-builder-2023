import React, { ChangeEvent, FC, HTMLAttributes, useCallback } from 'react';
import { FormContextType, useFormContext } from './FormContext';

export type InputProps = HTMLAttributes<HTMLInputElement> & {
  name: string;
};

export const Input: FC<InputProps> = ({ name, ...props }: InputProps) => {
  const outerFormContext = useFormContext();
  const { value, onChange }: Partial<FormContextType<Record<any, any>>> = outerFormContext || {};
  const onChangeInternal = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        const { target } = event;
        const newValue = target.type === 'checkbox' ? target.checked : target.value;

        onChange({
          ...value,
          [name]: newValue,
        });
      }
    },
    [value, onChange, name]
  );

  return <input {...props} onChange={onChangeInternal} />;
};
