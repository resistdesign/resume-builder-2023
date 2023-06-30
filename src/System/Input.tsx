import React, { ChangeEvent, FC, useCallback, useMemo } from 'react';
import { TypeStructure } from './TypeParsing/TypeUtils';
import { getUUID } from './IdUtils';
import styled from 'styled-components';

export const TYPE_TO_INPUT_TYPE_MAP = {
  string: 'text',
  number: 'number',
  boolean: 'checkbox',
  Date: 'date',
  DateTime: 'datetime-local',
  LongText: 'textarea',
  Rating: 'number',
  any: 'text',
};

const RatingBase = styled.fieldset`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
  padding: 1em;
  border: 0.05em solid var(--form-element-border-color);
  box-sizing: border-box;
`;

const RatingStar = styled.input`
  color: var(--form-element-color);

  &:checked {
    color: var(--primary);
  }
`;

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
        const newValue =
          type === TYPE_TO_INPUT_TYPE_MAP.boolean
            ? checked ?? false
            : type === TYPE_TO_INPUT_TYPE_MAP.Rating
            ? parseInt(inputValue, 10)
            : inputValue;

        onChange(name, newValue);
      }
    },
    [name, type, value, onChange]
  );
  const cleanValue = useMemo(
    () => (type === TYPE_TO_INPUT_TYPE_MAP.boolean ? value ?? false : value ?? ''),
    [type, value]
  );
  const styleObj = useMemo(() => ({ gridArea: name }), [name]);

  return type === TYPE_TO_INPUT_TYPE_MAP.Rating ? (
    <RatingBase>
      <legend>{label}</legend>
      <RatingStar type="radio" name={name} value={1} checked={cleanValue >= 1} onChange={onChangeInternal} />
      <RatingStar type="radio" name={name} value={2} checked={cleanValue >= 2} onChange={onChangeInternal} />
      <RatingStar type="radio" name={name} value={3} checked={cleanValue >= 3} onChange={onChangeInternal} />
      <RatingStar type="radio" name={name} value={4} checked={cleanValue >= 4} onChange={onChangeInternal} />
      <RatingStar type="radio" name={name} value={5} checked={cleanValue >= 5} onChange={onChangeInternal} />
    </RatingBase>
  ) : type === TYPE_TO_INPUT_TYPE_MAP.boolean ? (
    <input
      readOnly={readonly}
      placeholder={label}
      type={type}
      checked={!!cleanValue}
      onChange={onChangeInternal}
      style={styleObj}
    />
  ) : type === TYPE_TO_INPUT_TYPE_MAP.LongText ? (
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
