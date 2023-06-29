import React, { ChangeEvent, FC, useCallback, useMemo } from 'react';
import { TypeStructure } from './TypeParsing/TypeUtils';
import { getUUID } from './IdUtils';

enum InputType {
  checkbox = 'checkbox',
  textarea = 'textarea',
}

export type InputProps = {
  name: string;
  label?: string;
  type?: string;
  value: any;
  onChange: (name: string, newValue: any) => void;
  options?: TypeStructure | string[];
  allowCustomValue?: boolean;
  readonly?: boolean;
};

export const Input: FC<InputProps> = ({
  name,
  label = '',
  type = 'text',
  value,
  onChange,
  options,
  allowCustomValue,
  readonly = false,
}: InputProps) => {
  const inputUUID = useMemo(() => getUUID(), []);
  const optionsList = useMemo(() => {
    if (Array.isArray(options)) {
      return options;
    } else {
      const { content = [] } = options || {};

      return content.map(({ type }) => type.replace(/['"]/gim, () => ''));
    }
  }, [options]);
  const onChangeInternal = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    <input
      readOnly={readonly}
      placeholder={label}
      type={type}
      checked={!!cleanValue}
      onChange={onChangeInternal}
      style={styleObj}
    />
  ) : type === InputType.textarea ? (
    <textarea
      readOnly={readonly}
      placeholder={label}
      value={cleanValue}
      onChange={onChangeInternal}
      style={styleObj}
      rows={5}
    />
  ) : options && !allowCustomValue ? (
    <select disabled={readonly} value={cleanValue} onChange={onChangeInternal} style={styleObj}>
      <option value="">{label}</option>
      {optionsList.map((o, index) => (
        <option key={index} value={o}>
          {o}
        </option>
      ))}
    </select>
  ) : (
    <>
      <input
        readOnly={readonly}
        placeholder={label}
        type={type}
        value={`${cleanValue}`}
        onChange={onChangeInternal}
        style={styleObj}
        list={options && allowCustomValue ? inputUUID : undefined}
      />
      {options && allowCustomValue ? (
        <datalist id={inputUUID}>
          {optionsList.map((o, index) => (
            <option key={index} value={o} />
          ))}
        </datalist>
      ) : undefined}
    </>
  );
};
