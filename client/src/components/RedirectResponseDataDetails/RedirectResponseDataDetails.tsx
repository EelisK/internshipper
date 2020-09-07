import * as React from "react";
import { formatDistance } from "date-fns";
import {
  RedirectResponseData,
  DeleteRedirectResponseData,
  ConfirmRedirectResponseData,
} from "../../api/types";
import { Box, Text, Button, Anchor } from "grommet";
import { Info, Close } from "grommet-icons";

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

export const DeleteRedirectResponseDataDetailsDescription: React.FC<{
  data: DeleteRedirectResponseData;
}> = ({ data }) => (
  <>
    <Text>
      Job search stopped. Found overall {data.payload.found_jobs.length} jobs
      matching the provided criteria. This search lasted{" "}
      <Text weight="bold">
        {formatDistance(new Date(), new Date(data.payload.created_at))}.
      </Text>{" "}
      {data.payload.found_jobs.length !== 0 &&
        "Hopefully at least one of them was suitable for you."}{" "}
    </Text>
    <Text>
      The data related to this search has now been deleted from the
      internshipper.io platform.
    </Text>
  </>
);

export const ConfirmRedirectResponseDataDetailsDescription: React.FC<{
  data: ConfirmRedirectResponseData;
}> = ({ data }) => (
  <Text>
    You have now confirmed your subscription for internship positions. Note that
    you may stop receiving these updates at any time by clicking{" "}
    <Text color="brand">
      <Anchor href={`/jobs/delete/${data.payload.id}`} label="this link" />
    </Text>
    . This link will be included in the subsequent emails, so you don't need
    worry about saving it for now.
  </Text>
);

export const RedirectResponseDataDetailsDescription: React.FC<{
  data: RedirectResponseData;
}> = ({ data }) => {
  switch (data.action) {
    case "CONFIRM_JOB":
      return <ConfirmRedirectResponseDataDetailsDescription data={data} />;
    case "DELETE_JOB":
      return <DeleteRedirectResponseDataDetailsDescription data={data} />;
    default:
      throw new Error("Unexpected data provided in redirect response");
  }
};
