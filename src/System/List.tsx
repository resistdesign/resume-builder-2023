import React, { FC, useCallback, useMemo } from 'react';
import { getDefaultItemForTypeStructure, getTypeStructureIsPrimitive, TypeStructure } from './TypeParsing/TypeUtils';
import { TAG_TYPES } from './TypeStructureComponent';

export const getCleanPrimitiveStringValue = (value: any): string =>
  value !== undefined && value !== null ? `${value}` : '';

export const getItemName = <ValueType extends Record<any, any>>(
  item: ValueType = {} as any,
  itemNameTemplate: string = ''
): string => itemNameTemplate.replace(/\`(\w+)\`/g, (match, key) => getCleanPrimitiveStringValue(item[key]));

type OpenItemButtonProps = {
  index: number;
  onOpenItem: (index: number) => void;
};

const OpenItemButton: FC<OpenItemButtonProps> = ({ index, onOpenItem }: OpenItemButtonProps) => {
  const onOpenItemInternal = useCallback(() => {
    onOpenItem(index);
  }, [index, onOpenItem]);

  return (
    <button onClick={onOpenItemInternal} title="Open">
      Open
    </button>
  );
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
  // TODO: Edit/View/Details/Delete buttons.
  // TODO: Reordering.
  // TODO: String label template.

  return (
    <ul>
      {items.map((item, index) => {
        return (
          <li key={index}>
            {itemsArePrimitive ? getCleanPrimitiveStringValue(item) : getItemName(item, itemNameTemplate)}
            <OpenItemButton index={index} onOpenItem={onOpenItem} />
          </li>
        );
      })}
      <li>
        <button onClick={onAddItem}>+ Add Item</button>
      </li>
    </ul>
  );
};
