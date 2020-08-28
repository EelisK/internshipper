import * as React from "react";
import { Box } from "grommet";

export interface Props {
  children: React.ReactNode;
}

export const GlobalContainer: React.FC<Props> = (props) => (
  <Box height="100%">{props.children}</Box>
);
