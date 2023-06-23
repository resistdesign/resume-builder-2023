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

export const convertTypeStructureToInputs = (
    name: string,
    typeStructure: TypeStructure,
    typeStructureMap: TypeStructureMap
) => {
    const {contentNames} = typeStructure;
    const {
        type: typeStructureType,
        multiple: typeStructureMultiple,
        content = [],
    } = getTypeStructureWithFilteredContent(contentNames, typeStructure);
    const typeIsPrimitive = !(typeStructureType in typeStructureMap);
    const inputType = TYPE_TO_INPUT_TYPE_MAP[typeStructureType];

    if (typeStructureMultiple) {
        // TODO: Need a list component.
    } else {
        if (typeIsPrimitive) {
            return <Input key={name} name={name} type={inputType}/>;
        } else {
            return content.map((tS) => {
                const {name: tSName,} = tS;
                return convertTypeStructureToInputs(tSName, tS, typeStructureMap);
            };
        }
    }
};
