import * as React from "react";

export interface RequestStateContextValue {
  state: RequestState;
  setState: (state: RequestState) => any;
}

export const RequestStateContext = React.createContext<
  RequestStateContextValue | {}
>({});

export const useRequestState = (): [
  RequestState,
  (state: RequestState) => any
] => {
  const context = React.useContext(RequestStateContext);
  if ("state" in context) return [context.state, context.setState];

  throw new Error("No RequestState instance found");
};

export type RequestState =
  | ErrorRequestState
  | IdleRequestState
  | LoadingRequestState;

export interface ErrorRequestState {
  status: "error";
  error: Error;
}
export interface IdleRequestState {
  status: "idle";
}
export interface LoadingRequestState {
  status: "loading";
}
