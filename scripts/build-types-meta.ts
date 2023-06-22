import FS from 'fs';
import Path from 'path';
import { convertTypeScriptToTypeStructureMap } from '../src/System/TypeParsing/TypeParsing';
import { TypeStructure, TypeStructureMap } from '../src/System/TypeParsing/TypeUtils';

const TYPES_DIRECTORY_PATH = Path.join(__dirname, '..', 'src', 'Types');
const OUTPUT_JSON_PATH = Path.join(__dirname, '..', 'src', 'Meta', 'TypeStructureMap.json');
const TYPE_FILE_LIST = FS.readdirSync(TYPES_DIRECTORY_PATH);

let TYPE_STRUCTURE_MAP: Record<string, TypeStructure> = {};

for (const typeFileName of TYPE_FILE_LIST) {
  const typeFilePath = Path.join(TYPES_DIRECTORY_PATH, typeFileName);
  const typeFileContent = FS.readFileSync(typeFilePath, 'utf8');
  const currentTypeStructureMap: TypeStructureMap = convertTypeScriptToTypeStructureMap(typeFileContent);

  TYPE_STRUCTURE_MAP = {
    ...TYPE_STRUCTURE_MAP,
    ...currentTypeStructureMap,
  };
}

FS.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(TYPE_STRUCTURE_MAP, null, 2));
