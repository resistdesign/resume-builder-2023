import React, { FC } from 'react';

export const getItemName = <ValueType extends Record<any, any>>(
  item: ValueType = {} as any,
  itemNameTemplate: string = ''
): string =>
  itemNameTemplate.replace(/\`(\w+)\`/g, (match, key) =>
    item[key] !== undefined && item[key] !== null ? `${item[key]}` : ''
  );

export type ListProps<ValueType extends Record<any, any>> = {
  items: ValueType[];
  itemNameTemplate?: string;
};

export const List: FC<ListProps<any>> = <ValueType extends Record<any, any>>({
  items = [],
  itemNameTemplate = '',
}: ListProps<ValueType>) => {
  return (
    <ul>
      {items.map((item, index) => {
        return <li key={index}>{getItemName(item, itemNameTemplate)}</li>;
      })}
      <li>
        <button>More</button>
      </li>
    </ul>
  );
};
