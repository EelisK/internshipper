import * as React from "react";
import { Box, Text } from "grommet";
import { Close } from "grommet-icons";
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

export const StateOverlay: React.FC<Props> = (props) => {
  const [includeExtraInfo, setIncludeExtraInfo] = React.useState<boolean>(true);
  React.useEffect(() => {
    setIncludeExtraInfo(true);
  }, [props.state]);

  return (
    <Box style={REQUEST_STATUS_STYLES[props.state.status]}>
      {includeExtraInfo && props.state.status === "error" && (
        <Box pad="medium" direction="row">
          <Box align="center" width="100%">
            <Text color="status-error">{props.state.error.message}</Text>
          </Box>
          <Box
            style={{ cursor: "pointer" }}
            onClick={() => setIncludeExtraInfo(false)}
            margin={{ left: "auto" }}
          >
            <Close />
          </Box>
        </Box>
      )}
      {props.children}
    </Box>
  );
};

export type WrapperProps = Omit<Props, "state">;

export const StateOverlayWrapper: React.FC<WrapperProps> = (props) => {
  const [state] = useRequestState();
  return <StateOverlay state={state} {...props} />;
};
