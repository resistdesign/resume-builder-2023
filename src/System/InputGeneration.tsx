import {TypeStructure, TypeStructureMap} from "./TypeParsing/TypeUtils";

export const TYPE_TO_INPUT_TYPE_MAP : Record<string, string> = {
    "string": "text",
    "number": "number",
    "boolean": "checkbox",
    "Date": "date",
    "any": "text",
    "object": "text",
    "array": "text",
};

export const convertTypeStructureToInputs = (
    typeStructure: TypeStructure,
    typeStructureMap: TypeStructureMap
) => {
    const {
        type: typeStructureType,
    } = typeStructure;
    const typeIsPrimitive = !(typeStructureType in typeStructureMap);

    if (typeIsPrimitive) {

    }else{

    }
};
