import * as React from "react";
import { RedirectResponseData } from "../../api/types";
import { Box, Text, Button } from "grommet";
import { Info, Close } from "grommet-icons";
import { RedirectResponseDataDetailsDescription } from "./Description";

export interface Props {
  data: RedirectResponseData;
  onClose: () => any;
}

export const HUMANIZED_ACTION_TITLES: Record<
  RedirectResponseData["action"],
  string
> = {
  CONFIRM_JOB: "Subscription confirmed",
  DELETE_JOB: "Job search stopped",
};

export const RedirectResponseDataDetails: React.FC<Props> = ({
  data,
  onClose,
}) => (
  <Box pad="none" direction="column">
    <Box pad="medium" direction="row">
      <Box pad={{ horizontal: "small" }}>
        <Info />
      </Box>
      <Box pad={{ horizontal: "small" }}>
        <Text size="large">{HUMANIZED_ACTION_TITLES[data.action]}</Text>
      </Box>
      <Box
        style={{ cursor: "pointer" }}
        onClick={onClose}
        margin={{ left: "auto" }}
      >
        <Close />
      </Box>
    </Box>
    <Box border="all" />
    <Box pad="medium">
      <RedirectResponseDataDetailsDescription data={data} />
    </Box>
    <Box pad="medium" align="start">
      <Button color="brand" onClick={onClose}>
        Close
      </Button>
    </Box>
  </Box>
);
