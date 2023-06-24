import React, { ChangeEvent, FC, useCallback, useMemo } from 'react';

enum InputType {
  checkbox = 'checkbox',
}

export type InputProps = {
  name: string;
  label?: string;
  type?: string;
  value: any;
  onChange: (name: string, newValue: any) => void;
};

export const Input: FC<InputProps> = ({ name, label = '', type = 'text', value, onChange }: InputProps) => {
  const onChangeInternal = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        const { target } = event;
        const { checked, value: inputValue } = target;
        const newValue = type === InputType.checkbox ? checked ?? false : inputValue ?? '';

        onChange(name, newValue);
      }
    },
    [name, type, value, onChange]
  );
  const cleanValue = useMemo(() => (type === InputType.checkbox ? value ?? false : value ?? ''), [type, value]);

  return type === InputType.checkbox ? (
    <input placeholder={label} type={type} checked={!!cleanValue} onChange={onChangeInternal} />
  ) : (
    <input placeholder={label} type={type} value={`${cleanValue}`} onChange={onChangeInternal} />
  );
};
