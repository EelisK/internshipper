import * as React from "react";
import { InternshipperClient } from "../api/InternshipperClient";

export interface InternshipperClientContextValue {
  client?: InternshipperClient;
}

export const InternshipperClientContext = React.createContext<
  InternshipperClientContextValue
>({});

export const useInternshipperClient = (): InternshipperClient => {
  const { client } = React.useContext(InternshipperClientContext);
  if (!client) {
    throw new Error("No InternshipperClient instance found");
  }

  return client;
};
