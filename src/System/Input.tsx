import React, { ChangeEvent, FC, useCallback, useMemo } from 'react';
import { FormContextType, useFormContext } from './FormContext';

export type InputProps = {
  name: string;
  label?: string;
  type?: string;
};

export const Input: FC<InputProps> = ({ name, label = '', type = 'text' }: InputProps) => {
  const outerFormContext = useFormContext();
  const { value, onChange }: Partial<FormContextType<Record<any, any>>> = outerFormContext || {};
  const inputValue = useMemo(() => {
    const inpV = value?.[name];

    return inpV !== undefined && inpV !== null ? inpV : '';
  }, [name, value]);
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

  return <input placeholder={label} value={inputValue} onChange={onChangeInternal} />;
};
