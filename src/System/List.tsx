import React, { FC, PropsWithChildren, useCallback, useState } from 'react';
import {
  getDefaultItemForTypeStructure,
  getValueLabel,
  TypeStructure,
  TypeStructureMap,
} from './TypeParsing/TypeUtils';
import { NavigateBackHandler, NavigateToHandler } from './Navigation';
import styled from 'styled-components';

const ITEM_PLACEHOLDER = {};

const SelectItemButtonBase = styled.button`
  flex: 0 0 auto;
  width: revert;
`;

type SelectItemButtonBaseProps = {
  index: number;
  onSelectItem: (index: number) => void;
};

type SelectItemButtonProps = PropsWithChildren<SelectItemButtonBaseProps>;

const SelectItemButton: FC<SelectItemButtonProps> = ({ index, onSelectItem, children }: SelectItemButtonProps) => {
  const onOpenItemInternal = useCallback(() => {
    onSelectItem(index);
  }, [index, onSelectItem]);

  return <SelectItemButtonBase onClick={onOpenItemInternal}>{children}</SelectItemButtonBase>;
};

type SelectItemCheckboxProps = SelectItemButtonBaseProps & {
  selected: boolean;
};

const SelectItemCheckbox: FC<SelectItemCheckboxProps> = ({
  index,
  onSelectItem,
  selected = false,
}: SelectItemButtonProps) => {
  const onOpenItemInternal = useCallback(() => {
    onSelectItem(index);
  }, [index, onSelectItem]);

  return (
    <label>
      <input type="checkbox" checked={selected} onChange={onOpenItemInternal} />
    </label>
  );
};

const ListBase = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 1em;
`;
const ItemBase = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  gap: 1em;
`;
const ItemLabelBase = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
  width: auto;
`;

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
        const labelFromItem = (getItemLabel(item) || '').trim();
        const itemLabel = labelFromItem || `${index + 1}`;

        onNavigateToPath({
          label: itemLabel,
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
      const newItems = [...items, ITEM_PLACEHOLDER]
        .reduce((acc, itm, ind) => {
          if (selectedIndices.includes(ind)) {
            return [...acc, ITEM_PLACEHOLDER];
          }

          if (ind === moveItemsToIndex) {
            return [...acc, ...selectedIndices.map((i) => items[i]), itm];
          }

          return [...acc, itm];
        }, [])
        .filter((i: any) => i !== ITEM_PLACEHOLDER);

      onChangeInternal(newItems);

      onCleanupMovingItems();
    },
    [items, onChangeInternal, onCleanupMovingItems, selectedIndices]
  );

  return (
    <ListBase>
      {items.map((item, index) => {
        return itemsAreMoving && selectedIndices.includes(index) ? undefined : (
          <ItemBase key={index}>
            {itemsAreMoving ? (
              <SelectItemButton index={index} onSelectItem={onMoveItems}>
                Move Here
              </SelectItemButton>
            ) : (
              <SelectItemCheckbox
                index={index}
                onSelectItem={onToggleItemSelected}
                selected={selectedIndices.includes(index)}
              />
            )}
            <ItemLabelBase>{getItemLabel(item)}</ItemLabelBase>
            <SelectItemButton index={index} onSelectItem={onOpenItem}>
              Open
            </SelectItemButton>
            <SelectItemButton index={index} onSelectItem={onDeleteItem}>
              Delete
            </SelectItemButton>
          </ItemBase>
        );
      })}
      <ItemBase>
        {selectedIndices.length > 0 ? (
          <>
            {itemsAreMoving ? (
              <>
                <SelectItemButton index={items.length} onSelectItem={onMoveItems}>
                  Move Here
                </SelectItemButton>
                <button onClick={onCleanupMovingItems}>Cancel</button>
              </>
            ) : (
              <button onClick={onSetItemsAreMoving}>Move Item(s)</button>
            )}
          </>
        ) : undefined}
        {itemsAreMoving ? undefined : (
          <>
            <button onClick={onAddItem}>+ Add Item</button>
            <button onClick={onNavigateBack}>Done</button>
          </>
        )}
      </ItemBase>
    </ListBase>
  );
};
