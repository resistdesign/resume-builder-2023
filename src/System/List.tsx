import React, { FC, useCallback } from 'react';

export const getCleanPrimitiveStringValue = (value: any): string =>
  value !== undefined && value !== null ? `${value}` : '';

export const getItemName = <ValueType extends Record<any, any>>(
  item: ValueType = {} as any,
  itemNameTemplate: string = ''
): string => itemNameTemplate.replace(/\`(\w+)\`/g, (match, key) => getCleanPrimitiveStringValue(item[key]));

export type ListProps = {
  name: string;
  items: any[];
  onChange?: (name: string, value: any) => void;
  itemNameTemplate?: string;
  itemsArePrimitive?: boolean;
  onNavigateToPath?: (path: string[]) => void;
};

export const List: FC<ListProps> = ({
  name = '',
  items = [],
  onChange,
  itemNameTemplate = '',
  itemsArePrimitive = false,
  onNavigateToPath,
}: ListProps) => {
  const onChangeInternal = useCallback(
    (value: any) => {
      if (onChange) {
        onChange(name, value);
      }
    },
    [name, onChange]
  );
  const onAddItem = useCallback(() => {
    onChangeInternal([...items, {}]);
  }, [items, onChangeInternal]);
  // TODO: Edit/View/Details/Delete buttons.
  // TODO: Reordering.

  return (
    <ul>
      {items.map((item, index) => {
        return (
          <li key={index}>
            {itemsArePrimitive ? getCleanPrimitiveStringValue(item) : getItemName(item, itemNameTemplate)}

          </li>
        );
      })}
      <li>
        <button>More</button>
      </li>
    </ul>
  );
};
