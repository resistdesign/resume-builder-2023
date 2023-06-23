import {getTypeStructureWithFilteredContent, TypeStructure, TypeStructureMap} from './TypeParsing/TypeUtils';
import {Input} from './Input';

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

export const convertTypeStructureToInputs = (
    name: string,
    typeStructure: TypeStructure,
    typeStructureMap: TypeStructureMap
) => {
    const {contentNames} = typeStructure;
    const {
        type: typeStructureType,
        multiple: typeStructureMultiple,
        tags: typeStructureTags = {},
        content: typeStructureContent = [],
        // TODO: Consider literal.
        literal: typeStructureLiteral,
    } = getTypeStructureWithFilteredContent(contentNames, typeStructure);
    const typeIsPrimitive = !typeStructureContent || typeStructureContent.length < 1;
    const inputType = TYPE_TO_INPUT_TYPE_MAP[typeStructureType];
    const {
        [TAG_TYPES.inline]: typeStructureInline,
        [TAG_TYPES.label]: typeStructureLabel,
    } = typeStructureTags;
    const {
        value: typeStructureInlineValue = false,
    } = typeof typeStructureInline !== 'string' ? typeStructureInline : {};
    const {
        value: typeStructureLabelValue = '',
    } = typeof typeStructureLabel !== 'string' ? typeStructureLabel : {};
    // TODO: Consider layout.

    if (typeStructureMultiple) {
        // TODO: Need a list component.
    } else {
        if (typeIsPrimitive) {
            return <Input key={name} name={name} label={typeStructureLabelValue} type={inputType}/>;
        } else if (typeStructureInlineValue) {
            return typeStructureContent.map((tS) => {
                const {name: tSName,} = tS;
                return convertTypeStructureToInputs(tSName, tS, typeStructureMap);
            };
        } else {
            // TODO: Need link to new form.
        }
    }
};
