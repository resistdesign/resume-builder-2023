import { createContext, useContext } from 'react';

export type FormContextType<ValueType extends Record<any, any>> = {
  value: ValueType;
  onChange: (value: ValueType) => void;
};

export const FormContext = createContext<FormContextType<any> | undefined>(undefined);

export const { Consumer: FormContextConsumer, Provider: FormContextProvider } = FormContext;

export const useFormContext = <ValueType extends Record<any, any>>() =>
  useContext<FormContextType<ValueType> | undefined>(FormContext);
