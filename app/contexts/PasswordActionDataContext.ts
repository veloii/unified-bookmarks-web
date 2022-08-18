import { createContext } from "react";

export type PasswordActionData = {
  errors?: {
    oldPass?: string;
    newPass?: string;
  };
  success?: {
    password?: boolean;
  };
};

export type PasswordActionDataContextType = {
  passwordActionData?: PasswordActionData;
  setPasswordActionData: Function;
};

export const PasswordActionDataContext =
  createContext<PasswordActionDataContextType>({
    passwordActionData: undefined,
    setPasswordActionData: () => {},
  });

export const PasswordActionDataContextProvider =
  PasswordActionDataContext.Provider;
