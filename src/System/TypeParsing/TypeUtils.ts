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

export const getTypeStructureByName = <
  TypeStructureMapType extends TypeStructureMap,
  TypeStructureName extends keyof TypeStructureMapType
>(
  name: TypeStructureName,
  map: TypeStructureMapType
) => map[name];

export const getTypeStructureByPath = (
  path: (string | number)[],
  typeStructure: TypeStructure,
  typeStructureMap: TypeStructureMap
) => {
  const { multiple = false, content = [], type = '' } = typeStructure;
  const [_numericPathPart, ...multiPath] = path;
  const targetPath = multiple ? multiPath : path;

  let tS = {
    ...getTypeStructureByName(type, typeStructureMap),
    ...typeStructure,
  };

  if (targetPath.length > 0) {
    const [targetPathPart, ...remainingPath] = targetPath;
    const targetContent = content.find(({ name }) => name === targetPathPart);

    if (targetContent) {
      tS = getTypeStructureByPath(remainingPath, targetContent, typeStructureMap);
    }
  }

  return tS ? tS : ({} as any);
};

export const getTypeStructureIsPrimitive = (typeStructure: TypeStructure) => {
  const { literal = false, content = [] } = typeStructure;

  return literal && content.length === 0;
};

export const getDefaultItemForTypeStructure = (typeStructure: TypeStructure): any => {
  const { type, multiple } = typeStructure;
  const isPrimitive = getTypeStructureIsPrimitive(typeStructure);

  if (isPrimitive) {
    switch (type) {
      case 'string':
        return '';
      case 'number':
        return 0;
      case 'boolean':
        return false;
      default:
        return undefined;
    }
  } else {
    return multiple ? [] : {};
  }
};

export enum TAG_TYPES {
  label = 'label',
  inline = 'inline',
  layout = 'layout',
  itemName = 'itemName',
  options = 'options',
}

export const getCleanPrimitiveStringValue = (value: any): string =>
  value !== undefined && value !== null ? `${value}` : '';

export const getItemName = <ValueType extends Record<any, any>>(
  item: ValueType = {} as any,
  itemNameTemplate: string = ''
): string => itemNameTemplate.replace(/\`(\w+)\`/g, (match, key) => getCleanPrimitiveStringValue(item[key]));

export const getTagValue = (tagName: string, typeStructure: TypeStructure): string | boolean | undefined => {
  const { tags: { [tagName]: { value: tagValue = undefined } = {} } = {} } = typeStructure;

  return tagValue;
};

export const getTagValues = <TagName extends string>(
  tagNames: TagName[] = [],
  typeStructure: TypeStructure
): Record<TagName, any> => {
  const tagValues: Partial<Record<TagName, any>> = {};

  for (const tagName of tagNames) {
    tagValues[tagName] = getTagValue(tagName, typeStructure);
  }

  return tagValues as any;
};

export const getItemNameKeys = (itemNameTemplate: string = ''): string[] => itemNameTemplate.match(/\`(\w+)\`/g) ?? [];

export const getValueLabel = (value: any, typeStructure: TypeStructure, typeStructureMap: TypeStructureMap): string => {
  const itemNameTemplate = getTagValue(TAG_TYPES.itemName, typeStructure);

  if (typeof itemNameTemplate === 'string' && itemNameTemplate.trim() !== '') {
    const itemNameKeys = getItemNameKeys(itemNameTemplate);
    const templateValueItem: Record<string, any> = {};

    for (const itemNameKey of itemNameKeys) {
      const key = itemNameKey.replace(/\`/g, '');
      const typeStructureItem = getTypeStructureByPath([key], typeStructure, typeStructureMap);

      templateValueItem[key] = getValueLabel(value?.[key], typeStructureItem, typeStructureMap);
    }

    return getItemName(templateValueItem, itemNameTemplate);
  } else {
    return value === undefined || value === null ? '' : `${value}`;
  }
};
