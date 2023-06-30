import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  getTagValue,
  getTagValues,
  getTypeStructureByName,
  getTypeStructureByPath,
  getTypeStructureWithFilteredContent,
  getValueLabel,
  TAG_TYPES,
  TypeStructure,
  TypeStructureMap,
} from './TypeParsing/TypeUtils';
import { Input } from './Input';
import { Form } from './Form';
import { NavigateBackHandler, NavigateToHandler } from './Navigation';
import HashMatrix from './ValueProcessing/HashMatrix';
import {
  getLayoutContainerCSS,
  getTypeStructureLayoutGridTemplate,
  LayoutBox,
  LayoutContainerProps,
  LayoutControls,
} from './Layout';
import styled from 'styled-components';

const LayoutForm = styled(Form)<LayoutContainerProps>`
  ${(p) => getLayoutContainerCSS(p)}
`;

type OpenFormButtonProps = {
  name: string;
  label: string;
  onOpenForm: (name: string) => void;
};

const OpenFormButton: FC<OpenFormButtonProps> = ({ name, label, onOpenForm }) => {
  const onOpenFormInternal = useCallback(() => {
    onOpenForm(name);
  }, [name, onOpenForm]);

  return (
    <button type="button" onClick={onOpenFormInternal}>
      Edit {label}
    </button>
  );
};

export type TypeStructureComponentProps = {
  typeStructureMap: TypeStructureMap;
  typeStructure: TypeStructure;
  value: any;
  onChange: (name: string, value: any) => void;
  onNavigateToPath?: NavigateToHandler;
  onNavigateBack?: NavigateBackHandler;
  navigationPathPrefix?: string[];
  topLevel?: boolean;
  isEntryPoint?: boolean;
};

export const TypeStructureComponent: FC<TypeStructureComponentProps> = ({
  typeStructureMap,
  typeStructure,
  value,
  onChange,
  onNavigateToPath,
  onNavigateBack,
  navigationPathPrefix = [],
  topLevel = false,
  isEntryPoint = false,
}) => {
  const baseTypeStructure = useMemo(() => {
    const { type: typeStructureType = '' } = typeStructure;
    const topLevelTypeStructure = getTypeStructureByName(typeStructureType, typeStructureMap);

    return { ...topLevelTypeStructure, ...typeStructure };
  }, [typeStructureMap, typeStructure]);
  const isForm = useMemo(() => {
    const { content = [] } = baseTypeStructure;

    return content.length > 0;
  }, [baseTypeStructure]);
  const cleanTypeStructure = useMemo(() => {
    const { contentNames } = baseTypeStructure;

    return getTypeStructureWithFilteredContent(contentNames, baseTypeStructure);
  }, [baseTypeStructure]);
  const {
    name: typeStructureName = '',
    type: typeStructureType,
    content: typeStructureContent = [],
    literal: typeStructureLiteral = false,
    readonly = false,
  } = cleanTypeStructure;
  const {
    [TAG_TYPES.label]: typeStructureLabel = undefined,
    [TAG_TYPES.inline]: typeStructureInline = undefined,
    [TAG_TYPES.layout]: typeStructureLayout = undefined,
    [TAG_TYPES.options]: typeStructureOptionsString = undefined,
    [TAG_TYPES.optionsType]: typeStructureOptionsTypeName = undefined,
    [TAG_TYPES.allowCustomValue]: typeStructureAllowCustomValue = undefined,
  } = useMemo(
    () =>
      getTagValues(
        [
          TAG_TYPES.label,
          TAG_TYPES.inline,
          TAG_TYPES.layout,
          TAG_TYPES.options,
          TAG_TYPES.optionsType,
          TAG_TYPES.allowCustomValue,
        ],
        cleanTypeStructure
      ),
    [cleanTypeStructure]
  );
  const typeStructureOptions = useMemo(() => {
    if (typeof typeStructureOptionsString === 'string') {
      return typeStructureOptionsString
        .split('\n')
        .map((l) => l.split(','))
        .flat()
        .map((l) => l.trim());
    } else {
      return typeStructureOptionsTypeName && typeof typeStructureOptionsTypeName === 'string'
        ? getTypeStructureByName(typeStructureOptionsTypeName, typeStructureMap)
        : undefined;
    }
  }, [typeStructureOptionsString, typeStructureOptionsTypeName, typeStructureMap]);
  const isMainForm = useMemo(
    () => (!typeStructureInline && !typeStructureLiteral) || topLevel,
    [typeStructureInline, typeStructureLiteral, topLevel]
  );
  const hasTypeStructureLayout = useMemo(() => typeof typeStructureLayout === 'string', [typeStructureLayout]);
  const [internalValueBase, setInternalValue] = useState(value);
  const valueLastChanged = useMemo(() => new Date().getTime(), [value]);
  const internalValueLastChanged = useMemo(() => new Date().getTime(), [internalValueBase]);
  const internalValue = useMemo(
    () => (valueLastChanged > internalValueLastChanged ? value : internalValueBase),
    [value, internalValueBase, valueLastChanged, internalValueLastChanged]
  );
  const hasChanges = useMemo(() => internalValue !== value, [internalValue, value]);
  const submissionTypeName = useMemo(() => {
    return topLevel ? '' : typeStructureName;
  }, [topLevel, typeStructureName]);
  const onFormSubmit = useCallback(() => {
    onChange(submissionTypeName, internalValue);

    if (onNavigateBack) {
      onNavigateBack();
    }
  }, [topLevel, submissionTypeName, internalValue, onNavigateBack]);
  const onResetForm = useCallback(() => {
    setInternalValue(value);
  }, [value]);
  const onCancelForm = useCallback(() => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  }, [onNavigateBack]);
  const onPropertyChange = useCallback(
    (n: string, v: any) => {
      const newValue = {
        ...internalValue,
        [n]: v,
      };

      setInternalValue(newValue);

      if (!isMainForm || isEntryPoint) {
        onChange(submissionTypeName, newValue);
      }
    },
    [internalValue, setInternalValue, isMainForm, isEntryPoint, onChange, submissionTypeName]
  );
  const onNavigateToPathInternal = useCallback(
    (path: string[] = []) => {
      if (onNavigateToPath) {
        const targetValue = new HashMatrix({ hashMatrix: internalValue }).getPath(path);
        const targetTypeStructure = getTypeStructureByPath(path, cleanTypeStructure, typeStructureMap);
        const { multiple: ttsMultiple } = targetTypeStructure;
        const targetLabel = getTagValue(TAG_TYPES.label, targetTypeStructure);
        const cleanTargetLabel = typeof targetLabel === 'string' ? targetLabel : '';

        onNavigateToPath({
          label: ttsMultiple ? cleanTargetLabel : getValueLabel(targetValue, targetTypeStructure, typeStructureMap),
          path: [...navigationPathPrefix, ...path],
        });
      }
    },
    [onNavigateToPath, navigationPathPrefix, internalValue, cleanTypeStructure, typeStructureMap]
  );
  const onOpenForm = useCallback(
    (name: string) => {
      onNavigateToPathInternal([name]);
    },
    [onNavigateToPathInternal]
  );
  const FormComp: FC = isMainForm ? LayoutForm : LayoutBox;
  const formProps = useMemo(() => {
    return {
      ...(isMainForm ? { onSubmit: onFormSubmit } : {}),
      $gridArea: !topLevel ? typeStructureName : undefined,
    };
  }, [isMainForm, onFormSubmit, topLevel, typeStructureName]);
  const layoutBoxProps = useMemo(() => {
    return {
      $isGrid: hasTypeStructureLayout,
      $gridTemplate: getTypeStructureLayoutGridTemplate(typeStructureLayout, topLevel),
    };
  }, [hasTypeStructureLayout, typeStructureLayout, topLevel]);
  const controls = useMemo(() => {
    return (
      <>
        {isMainForm && !isEntryPoint && hasChanges ? (
          <LayoutControls>
            <button
              style={{
                flex: '1 0 auto',
                width: 'auto',
              }}
              type="button"
              onClick={onCancelForm}
            >
              Cancel
            </button>
            <button
              style={{
                flex: '1 0 auto',
                width: 'auto',
              }}
              type="button"
              onClick={onResetForm}
            >
              Reset
            </button>
            <button
              style={{
                flex: '1 0 auto',
                width: 'auto',
              }}
              type="submit"
            >
              Submit
            </button>
          </LayoutControls>
        ) : undefined}
        {isMainForm && !isEntryPoint && !hasChanges ? (
          <LayoutControls>
            <button
              style={{
                flex: '1 0 auto',
                width: 'auto',
              }}
              type="button"
              onClick={onCancelForm}
            >
              Done
            </button>
          </LayoutControls>
        ) : undefined}
      </>
    );
  }, [isMainForm, isEntryPoint, hasChanges, onCancelForm, onResetForm, onFormSubmit]);

  if (isForm) {
    return (
      <FormComp {...(formProps as any)} $allowShrink={isMainForm}>
        <LayoutBox $allowShrink={isMainForm}>
          <LayoutBox {...(layoutBoxProps as any)} $allowShrink={false}>
            {typeStructureContent.map((tS) => {
              const { name: tSName, literal: tSLiteral = false, type: tSType, multiple: tSMultiple } = tS;
              const { [TAG_TYPES.inline]: tSInline, [TAG_TYPES.label]: tSLabel } = getTagValues(
                [TAG_TYPES.inline, TAG_TYPES.label],
                tS
              );
              const inputLabel = typeof tSLabel === 'string' ? tSLabel : tSName;
              const tSTypeIsTypeStructure = typeof tSType === 'string' && !!typeStructureMap[tSType];
              const useInputType = !tSTypeIsTypeStructure;

              if (!tSMultiple && (tSLiteral || tSInline || useInputType)) {
                return (
                  <TypeStructureComponent
                    key={tSName}
                    typeStructureMap={typeStructureMap}
                    typeStructure={tS}
                    value={internalValue?.[tSName]}
                    onChange={onPropertyChange}
                    onNavigateToPath={onNavigateToPath}
                    navigationPathPrefix={[tSName]}
                  />
                );
              } else {
                return <OpenFormButton key={tSName} name={tSName} label={inputLabel} onOpenForm={onOpenForm} />;
              }
            })}
          </LayoutBox>
        </LayoutBox>
        {controls}
      </FormComp>
    );
  } else {
    const inputComp = (
      <Input
        key={typeStructureName}
        name={typeStructureName}
        label={`${typeStructureLabel ?? ''}`}
        value={value}
        type={typeStructureType}
        onChange={onChange}
        options={typeStructureOptions}
        allowCustomValue={!!typeStructureAllowCustomValue}
        readonly={readonly}
      />
    );

    return topLevel ? (
      <LayoutBox $allowShrink>
        {inputComp}
        {controls}
      </LayoutBox>
    ) : (
      inputComp
    );
  }
};
