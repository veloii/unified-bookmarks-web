import type { Team } from "@prisma/client";
import { createContext } from "react";

export type CreateBookmarkActionData = {
  errors?: {
    name?: string;
    link?: string;
  };
};
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
  createBookmarkActionData: CreateBookmarkActionData;
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
