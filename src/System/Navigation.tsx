import React, { FC, MouseEvent as ReactMouseEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

export type NavigationPath = (string | number)[];

export type NavigationBreadcrumb = {
  label: string;
  path: NavigationPath;
  isListItem?: boolean;
};

export type NavigationTrail = NavigationBreadcrumb[];

export const navigateTo = (breadcrumb: NavigationBreadcrumb, trail: NavigationTrail = []): NavigationTrail => [
  ...trail,
  breadcrumb,
];

export const navigateBack = (trail: NavigationTrail = []): NavigationTrail => {
  const [_lastBreadCrumb, ...newTrail] = [...trail].reverse();

  return newTrail.reverse();
};

export const getNavigationPath = (trail: NavigationTrail = []): NavigationPath => {
  return trail.map(({ path }) => path).flat();
};

export type NavigateToHandler = (breadcrumb: NavigationBreadcrumb) => void;

export type NavigateBackHandler = () => void;

export type NavigationTrailSetter = (newTrail: NavigationTrail) => void;

export type Navigation = {
  trail: NavigationTrail;
  path: NavigationPath;
  onNavigateTo: NavigateToHandler;
  onNavigateBack: NavigateBackHandler;
  onSetTrail: NavigationTrailSetter;
};

export const useNavigation = (): Navigation => {
  const [trail, setTrail] = useState<NavigationTrail>([]);
  const path = useMemo(() => getNavigationPath(trail), [trail]);
  const onNavigateTo = useCallback(
    (breadcrumb: NavigationBreadcrumb) => setTrail(navigateTo(breadcrumb, trail)),
    [trail, setTrail]
  );
  const onNavigateBack = useCallback(() => setTrail(navigateBack(trail)), [trail, setTrail]);
  const navigation = useMemo(
    () => ({
      trail,
      path,
      onNavigateTo,
      onNavigateBack,
      onSetTrail: setTrail,
    }),
    [trail, path, onNavigateTo, onNavigateBack]
  );

  return navigation;
};

const BreadcrumbBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1em;
`;

export type NavigationBreadcrumbsProps = {
  trail: NavigationTrail;
  onChange: (newTrail: NavigationTrail) => void;
};

export const NavigationBreadcrumbs: FC<NavigationBreadcrumbsProps> = ({ trail, onChange }) => {
  const onGoToBreadcrumb = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      const {
        target: { value },
      } = event as any;
      const index = parseInt(value, 10);
      const newTrail = [...trail].slice(0, index + 1);

      onChange(newTrail);
    },
    [trail, onChange]
  );

  return (
    <BreadcrumbBox>
      {trail.length > 0 ? (
        <button type="button" value={-1} onClick={onGoToBreadcrumb}>
          Home
        </button>
      ) : undefined}
      {trail.map((bc, index) => {
        const { label } = bc;

        return (
          <button
            disabled={index === trail.length - 1}
            type="button"
            key={index}
            value={index}
            onClick={onGoToBreadcrumb}
          >
            {label}
          </button>
        );
      })}
    </BreadcrumbBox>
  );
};
