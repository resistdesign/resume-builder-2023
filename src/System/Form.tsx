import { ChangeEvent, FC, PropsWithChildren, useCallback } from 'react';

export type FormProps = PropsWithChildren & {
  onSubmit: () => void;
};

export const Form: FC<FormProps> = ({ onSubmit, children }) => {
  const onSubmitInternal = useCallback(
    (event: ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();

      onSubmit();
    },
    [onSubmit]
  );

  return <form onSubmit={onSubmitInternal}>{children}</form>;
};
