import React, { ChangeEvent, FC, useCallback } from 'react';
import { FormContextType, useFormContext } from './FormContext';

export type InputProps = {
  name: string;
  type?: string;
};

export const Input: FC<InputProps> = ({ name, type = 'text' }: InputProps) => {
  const outerFormContext = useFormContext();
  const { value, onChange }: Partial<FormContextType<Record<any, any>>> = outerFormContext || {};
  const onChangeInternal = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        const { target } = event;
        const { checked, value: inputValue } = target;
        const newValue = type === 'checkbox' ? checked : inputValue;

        onChange({
          ...value,
          [name]: newValue,
        });
      }
    },
    [name, type, value, onChange]
  );

  return <input onChange={onChangeInternal} />;
};
