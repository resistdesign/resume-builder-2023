const NOOP = () => undefined;

export type TypeStructure = {
  namespace?: string;
  name: string;
  typeAlias?: string;
  type: string;
  literal?: boolean;
  readonly?: boolean;
  optional?: boolean;
  varietyType?: boolean;
  comboType?: boolean;
  multiple?: boolean | number;
  contentNames?: {
    allowed?: string[];
    disallowed?: string[];
  };
  content?: TypeStructure[];
  comments?: string[];
  tags?: Record<
    string,
    {
      type?: string | undefined;
      value?: string | boolean | undefined;
    }
  >;
};

export type TypeStructureMap = Record<string, TypeStructure>;

export type TypeStructureControllerItemOrdering = {
  onAddItemBefore?: () => void;
  onAddItemAfter?: () => void;
  onRemoveItem?: () => void;
  onInsertItemBeforeHere?: (itemToInsert: any) => void;
  onInsertItemAfterHere?: (itemToInsert: any) => void;
};

export type TypeStructureControllerBase = TypeStructureControllerItemOrdering & {
  typeStructure: TypeStructure;
  value: any;
  onChange: (value: any) => void;
  isListItem?: boolean;
  listItemIndex?: number;
};

export type TypeStructureItemController = TypeStructureControllerBase & {
  contentControllers: TypeStructureController[];
};

export type TypeStructureItemListController = TypeStructureControllerBase & {
  value: any[];
  onChange: (value: any[]) => void;
  onAddItemAt: (index: number) => void;
  onRemoveItemAt: (index: number) => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  onInsertItemAt: (index: number, itemToInsert: any) => void;
  itemControllers: TypeStructureController[];
};

export type TypeStructureController = TypeStructureItemController | TypeStructureItemListController;

export const identifyValueType = (
  value: any,
  typeStructureVariety: TypeStructure[] = []
): TypeStructure | undefined => {
  const typeStructureMap: TypeStructureMap = typeStructureVariety.reduce<Record<string, TypeStructure>>(
    (acc, typeStructure) => {
      acc[typeStructure.type] = typeStructure;

      return acc;
    },
    {}
  );
  const valueTypeSignature: string[] | string =
    value && typeof value === 'object' ? Object.keys(value).sort() : typeof value;
  const scoreMap: Record<string, number> = {};

  for (const tS of typeStructureVariety) {
    if (typeof valueTypeSignature === 'string' && tS.type === valueTypeSignature) {
      return tS;
    } else if (valueTypeSignature instanceof Array) {
      const typeSignature = tS.content?.length ? tS.content.map((tSC) => tSC.name).sort() : tS.type;

      if (typeSignature instanceof Array) {
        for (const typeSigProp of typeSignature) {
          if (valueTypeSignature.includes(typeSigProp)) {
            scoreMap[tS.type] = scoreMap[tS.type] ? scoreMap[tS.type] + 1 : 1;
          } else {
            scoreMap[tS.type] = scoreMap[tS.type] ? scoreMap[tS.type] : 0;
          }
        }
      }
    }
  }

  const typeList = Object.keys(scoreMap);

  return typeList.reduce<TypeStructure | undefined>((acc, typeName) => {
    if (!acc || scoreMap[typeName] > (scoreMap[acc.type] || 0)) {
      return typeStructureMap[typeName];
    } else {
      return acc;
    }
  }, typeStructureVariety[0]);
};

export const combineTypeStructures = (
  name: string,
  type: string,
  typeStructures: TypeStructure[] = []
): TypeStructure | undefined => {
  let combinedTypeStructure: TypeStructure | undefined;

  for (const tS of typeStructures) {
    combinedTypeStructure = combinedTypeStructure
      ? {
          ...combinedTypeStructure,
          ...tS,
          content: [...(combinedTypeStructure.content || []), ...(tS.content || [])],
        }
      : tS;
  }

  return combinedTypeStructure
    ? {
        ...combinedTypeStructure,
        name,
        type,
      }
    : undefined;
};

export const getCleanType = (typeValue: string = '', namespace?: string): string => {
  const cleanType = typeValue.replace(/\[]/gim, () => '');

  return namespace ? `${namespace}.${cleanType}` : cleanType;
};

export const getTypeStructureWithFilteredContent = (
  { allowed = [], disallowed = [] }: TypeStructure['contentNames'] = {},
  typeStructure: TypeStructure
): TypeStructure => {
  const { content = [] } = typeStructure;
  const newContent =
    allowed && allowed.length > 0
      ? content.filter((tS) => allowed.includes(tS.name))
      : disallowed && disallowed.length > 0
      ? content.filter((tS) => !disallowed.includes(tS.name))
      : content;

  return {
    ...typeStructure,
    content: newContent,
  };
};

export const getCleanTypeStructure = (
  typeStructure: TypeStructure,
  typeStructureMap?: TypeStructureMap
): TypeStructure => {
  const { namespace, name, type, typeAlias, literal, comments = [], tags = {} }: TypeStructure = typeStructure;

  if (literal) {
    return typeStructure;
  } else {
    const cleanType = getCleanType(type);
    const cleanTypeWithNamespace = getCleanType(type, namespace);
    const { [cleanTypeWithNamespace]: mappedTypeStructureWithNamespace, [cleanType]: mappedTypeStructureNoNamespace } =
      typeStructureMap || {};
    const useMappedWithNamespace = !!mappedTypeStructureWithNamespace;
    const mappedTypeStructure = useMappedWithNamespace
      ? mappedTypeStructureWithNamespace
      : mappedTypeStructureNoNamespace;
    const { comments: mappedTypeStructureComments = [], tags: mappedTypeStructureTags = {} } =
      mappedTypeStructure || {};
    const mergedTypeStructure: TypeStructure = {
      ...typeStructure,
      ...mappedTypeStructure,
      name,
      typeAlias: mappedTypeStructure ? type : typeAlias,
      comments: [...comments, ...mappedTypeStructureComments],
      tags: { ...tags, ...mappedTypeStructureTags },
    };
    const typeForMatching = useMappedWithNamespace ? cleanTypeWithNamespace : cleanType;
    const cleanMappedType = getCleanType(mappedTypeStructure?.type || '', mappedTypeStructure?.namespace);

    if (mappedTypeStructure && cleanMappedType !== typeForMatching) {
      return getCleanTypeStructure(mergedTypeStructure, typeStructureMap);
    }

    return mergedTypeStructure;
  }
};

export const getTypeStructureController = (
  {
    typeStructure,
    value,
    onChange,
    onAddItemAfter = NOOP,
    onAddItemBefore = NOOP,
    onRemoveItem = NOOP,
    onInsertItemBeforeHere = NOOP,
    onInsertItemAfterHere = NOOP,
    ...other
  }: TypeStructureControllerBase,
  typeStructureMap?: TypeStructureMap
): TypeStructureController => {
  const { multiple = 0 }: TypeStructure = typeStructure;
  const cleanTypeStructure: TypeStructure = getCleanTypeStructure(typeStructure, typeStructureMap);
  const {
    varietyType,
    comboType,
    comments: cleanTypeStructureComments = [],
    tags: cleanTypeStructureTags = {},
  }: TypeStructure = cleanTypeStructure;
  const cleanTypeStructureCommentsAndTags = {
    comments: cleanTypeStructureComments,
    tags: cleanTypeStructureTags,
  };
  const typeStructureControllerItemOrdering: TypeStructureControllerItemOrdering = {
    onAddItemAfter,
    onAddItemBefore,
    onRemoveItem,
    onInsertItemBeforeHere,
    onInsertItemAfterHere,
  };

  if (multiple === true || (typeof multiple === 'number' && multiple > 0)) {
    const safeValue = value instanceof Array ? value : [];
    const safeMultiple: number = multiple === true ? 1 : multiple;
    const onAddItemAt = (index: number) => {
      const newValue = [...safeValue];

      newValue.splice(index, 0, undefined);

      onChange(newValue);
    };
    const onRemoveItemAt = (index: number) => {
      const newValue = [...safeValue];

      newValue.splice(index, 1);

      onChange(newValue);
    };
    const onMoveItem = (fromIndex: number, toIndex: number) => {
      const safeFromIndex = Math.max(0, Math.min(safeValue.length - 1, fromIndex));
      const safeToIndex = Math.max(0, Math.min(safeValue.length, toIndex));

      if (safeFromIndex !== safeToIndex) {
        const tempFirstItem = {};
        const tempLastItem = {};
        const newValue = [tempFirstItem, ...safeValue, tempLastItem];
        const itemToMove = newValue.splice(safeFromIndex + 1, 1)[0];

        newValue.splice(safeToIndex + 1, 0, itemToMove);

        onChange(newValue.filter((item) => item !== tempFirstItem && item !== tempLastItem));
      }
    };
    const onInsertItemAt = (index: number, itemToInsert: any) => {
      const newValue = [...safeValue];

      newValue.splice(index, 0, itemToInsert);

      onChange(newValue);
    };
    const extraIndex = safeValue.length;

    return {
      ...other,
      typeStructure: {
        ...cleanTypeStructure,
        multiple: multiple,
      },
      value,
      onChange,
      onAddItemAt,
      onRemoveItemAt,
      onMoveItem,
      onInsertItemAt,
      ...typeStructureControllerItemOrdering,
      itemControllers: [
        ...safeValue.map((itemValue, index) =>
          getTypeStructureController(
            {
              typeStructure: {
                ...cleanTypeStructure,
                multiple: safeMultiple - 1,
                // NOTE: No need to carry metadata down to each list item.
                comments: [],
                tags: {},
              },
              value: itemValue,
              onChange: (newItemValue) => {
                onChange([...safeValue].map((item, i) => (i === index ? newItemValue : item)));
              },
              isListItem: true,
              listItemIndex: index,
              onAddItemBefore: () => onAddItemAt(index),
              onAddItemAfter: () => {
                onAddItemAt(index + 1);
              },
              onRemoveItem: () => onRemoveItemAt(index),
              onInsertItemBeforeHere: (itemToInsert) => onInsertItemAt(index, itemToInsert),
              onInsertItemAfterHere: (itemToInsert) => onInsertItemAt(index + 1, itemToInsert),
            },
            typeStructureMap
          )
        ),

        getTypeStructureController(
          {
            typeStructure: {
              ...cleanTypeStructure,
              multiple: safeMultiple - 1,
              // NOTE: No need to carry metadata down to each list item.
              comments: [],
              tags: {},
            },
            value: undefined,
            onChange: (newItemValue) => {
              onChange([...safeValue, newItemValue]);
            },
            isListItem: true,
            listItemIndex: extraIndex,
            onAddItemBefore: () => onAddItemAt(extraIndex),
            onAddItemAfter: () => {
              onAddItemAt(extraIndex + 1);
            },
            onRemoveItem: () => onRemoveItemAt(extraIndex),
            onInsertItemBeforeHere: (itemToInsert) => onInsertItemAt(extraIndex, itemToInsert),
            onInsertItemAfterHere: (itemToInsert) => onInsertItemAt(extraIndex + 1, itemToInsert),
          },
          typeStructureMap
        ),
      ],
    };
  } else {
    const targetTypeStructure: TypeStructure = getTypeStructureWithFilteredContent(
      cleanTypeStructure.contentNames,
      varietyType &&
        // IMPORTANT: Use combineTypeStructures for varietyType when value is undefined.
        typeof value !== 'undefined'
        ? {
            ...(identifyValueType(
              value,
              (cleanTypeStructure.content || []).map((cTS) => getCleanTypeStructure(cTS, typeStructureMap))
            ) || cleanTypeStructure),
            ...cleanTypeStructureCommentsAndTags,
          }
        : comboType || varietyType
        ? {
            ...(combineTypeStructures(
              cleanTypeStructure.name,
              cleanTypeStructure.type,
              (cleanTypeStructure.content || []).map((cTS) => getCleanTypeStructure(cTS, typeStructureMap))
            ) || cleanTypeStructure),
            ...cleanTypeStructureCommentsAndTags,
          }
        : cleanTypeStructure
    );
    const { content: targetContent = [] } = targetTypeStructure;

    return {
      ...other,
      typeStructure: targetTypeStructure,
      value,
      onChange,
      ...typeStructureControllerItemOrdering,
      contentControllers: targetContent.map((contentTypeStructure) => {
        const { name: contentTypeStructureName } = contentTypeStructure;

        return getTypeStructureController(
          {
            typeStructure: contentTypeStructure,
            value: value?.[contentTypeStructureName],
            onAddItemAfter: NOOP,
            onAddItemBefore: NOOP,
            onRemoveItem: NOOP,
            onInsertItemBeforeHere: NOOP,
            onInsertItemAfterHere: NOOP,
            onChange: (newValue) => {
              onChange({
                ...value,
                [contentTypeStructureName]: newValue,
              });
            },
          },
          typeStructureMap
        );
      }),
    };
  }
};
