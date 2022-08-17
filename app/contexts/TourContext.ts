import { createContext } from "react";

export type Tour = number | boolean | undefined;

export type TourContextType = {
  tour?: Tour;
  setTour: Function;
};

export const TourContext = createContext<TourContextType>({
  tour: undefined,
  setTour: () => {},
});

export const TourContextProvider = TourContext.Provider;
