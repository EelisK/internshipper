import * as React from "react";
import { ConfirmRedirectResponseData } from "../../../api/types";
import { Text, Anchor } from "grommet";

export interface Props {
  data: ConfirmRedirectResponseData;
}

export const ConfirmRedirectResponseDataDetailsDescription: React.FC<Props> = ({
  data,
}) => (
  <Text>
    You have now confirmed your subscription for internship positions. Note that
    you may stop receiving these updates at any time by clicking{" "}
    <Text color="brand">
      <Anchor href={`/jobs/delete/${data.payload.id}`} label="this link" />
    </Text>
    . This link will be included in the subsequent emails, so you don&#39;t need
    worry about saving it for now.
  </Text>
);
