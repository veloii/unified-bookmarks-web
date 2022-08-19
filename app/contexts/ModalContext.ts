import type { Team } from "@prisma/client";
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

export type Modal = {
  passwordActionData: PasswordActionData;
  team: Team | undefined;
};

export type ModalContextType = {
  modal?: Modal;
  setModal: Function;
};

export const ModalContext = createContext<ModalContextType>({
  modal: undefined,
  setModal: () => {},
});

export const ModalContextProvider = ModalContext.Provider;
