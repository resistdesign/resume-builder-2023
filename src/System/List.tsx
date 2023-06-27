import React, { FC, PropsWithChildren, useCallback, useMemo } from 'react';
import { getDefaultItemForTypeStructure, getTypeStructureIsPrimitive, TypeStructure } from './TypeParsing/TypeUtils';
import { TAG_TYPES } from './TypeStructureComponent';

export const getCleanPrimitiveStringValue = (value: any): string =>
  value !== undefined && value !== null ? `${value}` : '';

export const getItemName = <ValueType extends Record<any, any>>(
  item: ValueType = {} as any,
  itemNameTemplate: string = ''
): string => itemNameTemplate.replace(/\`(\w+)\`/g, (match, key) => getCleanPrimitiveStringValue(item[key]));

type SelectItemButtonProps = PropsWithChildren<{
  index: number;
  onSelectItem: (index: number) => void;
}>;

const SelectItemButton: FC<SelectItemButtonProps> = ({ index, onSelectItem, children }: SelectItemButtonProps) => {
  const onOpenItemInternal = useCallback(() => {
    onSelectItem(index);
  }, [index, onSelectItem]);

  return <button onClick={onOpenItemInternal}>{children}</button>;
};

export type ListProps = {
  name: string;
  typeStructure: TypeStructure;
  items: any[];
  onChange?: (name: string, value: any) => void;
  onNavigateToPath?: (path: (string | number)[]) => void;
};

export const List: FC<ListProps> = ({
  name = '',
  typeStructure,
  items = [],
  onChange,
  onNavigateToPath,
}: ListProps) => {
  const itemNameTemplate = useMemo(() => {
    const { tags: { [TAG_TYPES.itemName]: { value = '' } = {} } = {} } = typeStructure;

    return typeof value === 'string' ? value : '';
  }, [typeStructure]);
  const itemsArePrimitive = useMemo(() => getTypeStructureIsPrimitive(typeStructure), [typeStructure]);
  const getItemLabel = useCallback(
    (item: any) => (itemsArePrimitive ? getCleanPrimitiveStringValue(item) : getItemName(item, itemNameTemplate)),
    [itemsArePrimitive, itemNameTemplate]
  );
  const onChangeInternal = useCallback(
    (value: any) => {
      if (onChange) {
        onChange(name, value);
      }
    },
    [name, onChange]
  );
  const onAddItem = useCallback(() => {
    onChangeInternal([...items, getDefaultItemForTypeStructure(typeStructure)]);
  }, [items, onChangeInternal, typeStructure]);
  const onOpenItem = useCallback(
    (index: number) => {
      if (onNavigateToPath) {
        onNavigateToPath([index]);
      }
    },
    [name, onNavigateToPath]
  );
  const onDeleteItem = useCallback(
    (index: number) => {
      onChangeInternal([...items.slice(0, index), ...items.slice(index + 1)]);
    },
    [items, onChangeInternal]
  );
  // TODO: Reordering.

  return (
    <ul>
      {items.map((item, index) => {
        return (
          <li key={index}>
            {getItemLabel(item)}
            <SelectItemButton index={index} onSelectItem={onOpenItem}>
              Open
            </SelectItemButton>
            <SelectItemButton index={index} onSelectItem={onDeleteItem}>
              Delete
            </SelectItemButton>
          </li>
        );
      })}
      <li>
        <button onClick={onAddItem}>+ Add Item</button>
      </li>
    </ul>
  );
};
