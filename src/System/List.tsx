import React, { FC } from 'react';

export const getCleanPrimitiveStringValue = (value: any): string =>
  value !== undefined && value !== null ? `${value}` : '';

export const getItemName = <ValueType extends Record<any, any>>(
  item: ValueType = {} as any,
  itemNameTemplate: string = ''
): string => itemNameTemplate.replace(/\`(\w+)\`/g, (match, key) => getCleanPrimitiveStringValue(item[key]));

export type ListProps = {
  items: any[];
  itemNameTemplate?: string;
  itemsArePrimitive?: boolean;
};

export const List: FC<ListProps> = ({ items = [], itemNameTemplate = '', itemsArePrimitive = false }: ListProps) => {
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
