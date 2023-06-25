import React, {FC, useMemo} from 'react';
import {getTypeStructureByName, getTypeStructureWithFilteredContent, TypeStructureMap} from './TypeParsing/TypeUtils';
import {Input} from "./Input";

export const TYPE_TO_INPUT_TYPE_MAP: Record<string, string> = {
    string: 'text',
    number: 'number',
    boolean: 'checkbox',
    Date: 'date',
    any: 'text',
    object: 'text',
    array: 'text',
};

export enum TAG_TYPES {
    label = 'label',
    inline = 'inline',
    layout = 'layout',
}

export type TypeStructureComponentProps = {
    typeStructureMap: TypeStructureMap;
    typeStructureName: string;
    value: any;
    onChange: (name: string, value: any) => void;
};

export const TypeStructureComponent: FC<TypeStructureComponentProps> = ({
                                                                            typeStructureMap,
                                                                            typeStructureName,
                                                                            value,
                                                                            onChange,
                                                                        }) => {
    const {
        type: typeStructureType,
        multiple: typeStructureMultiple,
        tags: typeStructureTags = {},
        content: typeStructureContent = [],
        literal: typeStructureLiteral,
    } = useMemo(() => {
        const tS = getTypeStructureByName(typeStructureName, typeStructureMap);
        const {contentNames} = tS;

        return getTypeStructureWithFilteredContent(contentNames, tS);
    }, [typeStructureMap, typeStructureName]);
    const inputType = TYPE_TO_INPUT_TYPE_MAP[typeStructureType];
    const {
        [TAG_TYPES.inline]: {value: typeStructureInline = undefined} = {},
        [TAG_TYPES.label]: {value: typeStructureLabel = undefined} = {},
        // TODO: Consider layout.
        [TAG_TYPES.layout]: {value: typeStructureLayout = undefined} = {},
    } = typeStructureTags;

    if (typeStructureMultiple) {
        // TODO: Need a list component.
    } else {
        if (typeStructureLiteral) {
            return <Input
                key={name}
                name={name}
                label={`${typeStructureLabel ?? ''}`}
                value={value} type={inputType}
                onChange={onInputChange}
            />;
        } else if (typeStructureInline) {
            return typeStructureContent.map((tS) => {
                const {name: tSName, type: tSType} = tS;
                const tsValue = value?.[tSName];

                return convertTypeStructureToInputs(tSName, tSType, typeStructureMap, tsValue, onInputChange);
            };
        } else {
            // TODO: Need link to new form.
        }
    }
};
