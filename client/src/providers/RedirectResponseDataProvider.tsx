import * as React from "react";
import { memoize } from "lodash";
import { RedirectResponseData } from "../api/types";

export interface RedirectResponseDataContextValue {
  data: RedirectResponseData | null;
}

export interface RedirectResponseDataProviderProps {
  children: React.ReactNode;
}

const DATA_HASH_MATCH = "#data=";

export const RedirectResponseDataContext = React.createContext<
  RedirectResponseDataContextValue
>({ data: null });

export const RedirectResponseDataProvider = ({
  children,
}: RedirectResponseDataProviderProps) => {
  const data = getRedirectResponseData();
  clearRedirectResponseData();

  return (
    <RedirectResponseDataContext.Provider value={{ data }}>
      {children}
    </RedirectResponseDataContext.Provider>
  );
};

export const useRedirectResponseData = (): RedirectResponseData | null => {
  const { data } = React.useContext(RedirectResponseDataContext);

  return data;
};

const getRedirectResponseData = memoize((): RedirectResponseData | null => {
  const hasRedirectData = location.hash.startsWith(DATA_HASH_MATCH);
  if (!hasRedirectData) return null;

  const base64Data = location.hash.substr(DATA_HASH_MATCH.length);
  const jsonString = atob(base64Data);
  return JSON.parse(jsonString);
});

const clearRedirectResponseData = () => {
  history.pushState("", document.title, location.pathname + location.search);
};
