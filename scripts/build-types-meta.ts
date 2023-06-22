import FS from 'fs';
import Path from 'path';

const TYPES_DIRECTORY_PATH = Path.join(__dirname, '..', 'src', 'Types');
const OUTPUT_JSON_PATH = Path.join(__dirname, '..', 'src', 'Meta', 'TypeStructureMap.json');
const TYPE_FILE_LIST = FS.readdirSync(TYPES_DIRECTORY_PATH);

console.log(TYPE_FILE_LIST);
