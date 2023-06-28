import React, { ChangeEvent, FC, useCallback, useMemo } from 'react';
import { TypeStructure } from './TypeParsing/TypeUtils';

enum InputType {
  checkbox = 'checkbox',
}

export type InputProps = {
  name: string;
  label?: string;
  type?: string;
  value: any;
  onChange: (name: string, newValue: any) => void;
  options?: TypeStructure;
};

export const Input: FC<InputProps> = ({ name, label = '', type = 'text', value, onChange, options }: InputProps) => {
  const optionsList = useMemo(() => {
    const { content = [] } = options || {};

    return content.map(({ type }) => type.replace(/['"]/gim, () => ''));
  }, [options]);
  const onChangeInternal = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (onChange) {
        const { target } = event;
        const { checked, value: inputValue } = target as any;
        const newValue = type === InputType.checkbox ? checked ?? false : inputValue ?? '';

        onChange(name, newValue);
      }
    },
    [name, type, value, onChange]
  );
  const cleanValue = useMemo(() => (type === InputType.checkbox ? value ?? false : value ?? ''), [type, value]);
  const styleObj = useMemo(() => ({ gridArea: name }), [name]);

  return type === InputType.checkbox ? (
    <input placeholder={label} type={type} checked={!!cleanValue} onChange={onChangeInternal} style={styleObj} />
  ) : options ? (
    <select value={cleanValue} onChange={onChangeInternal} style={styleObj}>
      {optionsList.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </select>
  ) : (
    <input placeholder={label} type={type} value={`${cleanValue}`} onChange={onChangeInternal} style={styleObj} />
  );
};
