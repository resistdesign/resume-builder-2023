import { useCallback, useMemo, useState } from 'react';

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

export type Navigation = {
  trail: NavigationTrail;
  path: NavigationPath;
  onNavigateTo: NavigateToHandler;
  onNavigateBack: NavigateBackHandler;
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
    }),
    [trail, path, onNavigateTo, onNavigateBack]
  );

  return navigation;
};
