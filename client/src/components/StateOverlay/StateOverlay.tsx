import * as React from "react";
import { Box } from "grommet";
import { RequestState, useRequestState } from "../../providers";

export interface Props {
  children: React.ReactNode;
  state: RequestState;
}

export const REQUEST_STATUS_STYLES: Record<
  RequestState["status"],
  React.CSSProperties
> = {
  loading: { opacity: 0.5 },
  error: {},
  idle: {},
};

export const StateOverlay: React.FC<Props> = (props) => (
  <Box style={REQUEST_STATUS_STYLES[props.state.status]}>{props.children}</Box>
);

export type WrapperProps = Omit<Props, "state">;

export const StateOverlayWrapper: React.FC<WrapperProps> = (props) => {
  const [state] = useRequestState();
  return <StateOverlay state={state} {...props} />;
};
