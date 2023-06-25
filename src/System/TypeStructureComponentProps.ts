import { TypeStructureMap } from './TypeParsing/TypeUtils';

export type TypeStructureComponentProps = {
  typeStructureMap: TypeStructureMap;
  typeStructureTypeName: string;
  name: string;
  value: any;
  onChange: (name: string, value: any) => void;
};
