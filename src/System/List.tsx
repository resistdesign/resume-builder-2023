import React, { FC, PropsWithChildren, useCallback, useState } from 'react';
import {
  getDefaultItemForTypeStructure,
  getValueLabel,
  TypeStructure,
  TypeStructureMap,
} from './TypeParsing/TypeUtils';
import { NavigateBackHandler, NavigateToHandler } from './Navigation';

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
  typeStructure: TypeStructure;
  typeStructureMap: TypeStructureMap;
  items: any[];
  onChange?: (value: any) => void;
  onNavigateToPath?: NavigateToHandler;
  onNavigateBack?: NavigateBackHandler;
};

export const List: FC<ListProps> = ({
  typeStructure,
  typeStructureMap,
  items = [],
  onChange,
  onNavigateToPath,
  onNavigateBack,
}: ListProps) => {
  const [selectedIndices, setSelectedIndices] = useState<any[]>([]);
  const [itemsAreMoving, setItemsAreMoving] = useState(false);
  const getItemLabel = useCallback(
    (item: any) => getValueLabel(item, typeStructure, typeStructureMap),
    [typeStructure, typeStructureMap]
  );
  const onChangeInternal = useCallback(
    (value: any) => {
      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );
  const onAddItem = useCallback(() => {
    onChangeInternal([...items, getDefaultItemForTypeStructure(typeStructure)]);
  }, [items, onChangeInternal, typeStructure]);
  const onOpenItem = useCallback(
    (index: number) => {
      if (onNavigateToPath) {
        const item = items?.[index];

        onNavigateToPath({
          label: getItemLabel(item) || `${index + 1}`,
          path: [index],
          isListItem: true,
        });
      }
    },
    [onNavigateToPath, items, getItemLabel]
  );
  const onDeleteItem = useCallback(
    (index: number) => {
      onChangeInternal([...items.slice(0, index), ...items.slice(index + 1)]);
    },
    [items, onChangeInternal]
  );
  const onToggleItemSelected = useCallback(
    (index: number) => {
      if (selectedIndices.includes(index)) {
        setSelectedIndices(selectedIndices.filter((ind) => ind !== index));
      } else {
        setSelectedIndices([...selectedIndices, index]);
      }
    },
    [selectedIndices, setSelectedIndices]
  );
  const onSetItemsAreMoving = useCallback(() => {
    setItemsAreMoving(true);
  }, [setItemsAreMoving]);
  const onCleanupMovingItems = useCallback(() => {
    setItemsAreMoving(false);
    setSelectedIndices([]);
  }, [setItemsAreMoving, setSelectedIndices]);
  const onMoveItems = useCallback(
    (moveItemsToIndex: number) => {
      const itemsWithoutSelected = [...items].filter((_itm, ind) => !selectedIndices.includes(ind));
      const selectedItems = [...items].filter((_itm, ind) => selectedIndices.includes(ind));
      const targetItem = items[moveItemsToIndex];
      const newTargetIndex = itemsWithoutSelected.indexOf(targetItem);
      const newItems = [
        ...itemsWithoutSelected.slice(0, newTargetIndex),
        ...selectedItems,
        ...itemsWithoutSelected.slice(newTargetIndex),
      ];

      onChangeInternal(newItems);

      onCleanupMovingItems();
    },
    [items, onChangeInternal, onCleanupMovingItems, selectedIndices]
  );

  return (
    <ul>
      {items.map((item, index) => {
        return itemsAreMoving && selectedIndices.includes(index) ? undefined : (
          <li key={index}>
            {itemsAreMoving ? (
              <SelectItemButton index={index} onSelectItem={onMoveItems}>
                Move Here
              </SelectItemButton>
            ) : (
              <SelectItemButton index={index} onSelectItem={onToggleItemSelected}>
                Select
              </SelectItemButton>
            )}
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
      {itemsAreMoving ? undefined : (
        <>
          <li>
            <button onClick={onAddItem}>+ Add Item</button>
          </li>
          <li>
            <button onClick={onNavigateBack}>Done</button>
          </li>
        </>
      )}
      {selectedIndices.length > 0 ? (
        <li>
          <button onClick={onSetItemsAreMoving}>Move Item(s)</button>
        </li>
      ) : undefined}
      {itemsAreMoving ? (
        <>
          <li>
            <SelectItemButton index={items.length} onSelectItem={onMoveItems}>
              Move Here
            </SelectItemButton>
          </li>
          <li>
            <button onClick={onCleanupMovingItems}>Cancel</button>
          </li>
        </>
      ) : undefined}
    </ul>
  );
};
