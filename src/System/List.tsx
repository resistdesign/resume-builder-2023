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

const DeleteButton = styled.button`
  background-color: #a41e1e;
`;

const SelectItemButtonBase = styled.button`
  flex: 0 0 auto;
  width: revert;
`;

type SelectItemButtonBaseProps = {
  index: number;
  onSelectItem: (index: number) => void;
};

type SelectItemButtonProps = PropsWithChildren<SelectItemButtonBaseProps>;

const SelectItemButton: FC<SelectItemButtonProps> = ({ index, onSelectItem, children }) => {
  const onOpenItemInternal = useCallback(() => {
    onSelectItem(index);
  }, [index, onSelectItem]);

  return <SelectItemButtonBase onClick={onOpenItemInternal}>{children}</SelectItemButtonBase>;
};

type SelectItemCheckboxProps = SelectItemButtonBaseProps & {
  selected: boolean;
};

const SelectItemCheckbox: FC<SelectItemCheckboxProps> = ({ index, onSelectItem, selected = false }) => {
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
const ControlBase = styled(ItemBase)`
  position: fixed;
  bottom: 0;
  padding: 1em;
  margin: 0 -1em 0 -1em;
  background-color: var(--background-color);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
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
  const [tryingToDeleteSelectedItems, setTryingToDeleteSelectedItems] = useState(false);
  const onBegineDelete = useCallback(() => {
    setTryingToDeleteSelectedItems(true);
  }, [setTryingToDeleteSelectedItems]);
  const [itemsAreMoving, setItemsAreMoving] = useState(false);
  const getItemLabel = useCallback(
    (item: any): string =>
      (getValueLabel(item, typeStructure, typeStructureMap) || '').trim() || `${items.indexOf(item) + 1}`,
    [typeStructure, typeStructureMap, items]
  );
  const onChangeInternal = useCallback(
    (value: any) => {
      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );
  const onCancelDelete = useCallback(() => {
    setTryingToDeleteSelectedItems(false);
  }, [setTryingToDeleteSelectedItems]);
  const onConfirmDelete = useCallback(() => {
    const newItems = items.filter((_, index) => !selectedIndices.includes(index));

    onChangeInternal(newItems);

    setTryingToDeleteSelectedItems(false);
    setSelectedIndices([]);
  }, [items, onChangeInternal, selectedIndices, setTryingToDeleteSelectedItems, setSelectedIndices]);
  const onAddItem = useCallback(() => {
    onChangeInternal([...items, getDefaultItemForTypeStructure(typeStructure)]);
  }, [items, onChangeInternal, typeStructure]);
  const onOpenItem = useCallback(
    (index: number) => {
      if (onNavigateToPath) {
        const item = items?.[index];

        onNavigateToPath({
          label: getItemLabel(item),
          path: [index],
          isListItem: true,
        });
      }
    },
    [onNavigateToPath, items, getItemLabel]
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
          </ItemBase>
        );
      })}
      <ControlBase>
        {selectedIndices.length > 0 ? (
          <>
            {itemsAreMoving ? (
              <>
                <SelectItemButton index={items.length} onSelectItem={onMoveItems}>
                  Move Here
                </SelectItemButton>
                <button onClick={onCleanupMovingItems}>Cancel</button>
              </>
            ) : tryingToDeleteSelectedItems ? (
              <>
                <button onClick={onCancelDelete}>Cancel Delete</button>
                <DeleteButton onClick={onConfirmDelete}>Confirm Delete</DeleteButton>
              </>
            ) : (
              <>
                <button onClick={onSetItemsAreMoving}>Move Item(s)</button>
                <button onClick={onBegineDelete}>Delete Item(s)</button>
              </>
            )}
          </>
        ) : undefined}
        {itemsAreMoving ? undefined : (
          <>
            <button onClick={onAddItem}>+ Add Item</button>
            <button onClick={onNavigateBack}>Done</button>
          </>
        )}
      </ControlBase>
    </ListBase>
  );
};
