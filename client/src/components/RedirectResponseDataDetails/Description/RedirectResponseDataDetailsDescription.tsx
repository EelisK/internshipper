import * as React from "react";
import { RedirectResponseData } from "../../../api/types";
import { ConfirmRedirectResponseDataDetailsDescription } from "./ConfirmRedirectResponseDataDetailsDescription";
import { DeleteRedirectResponseDataDetailsDescription } from "./DeleteRedirectResponseDataDetailsDescription";

export interface Props {
  data: RedirectResponseData;
}

export const RedirectResponseDataDetailsDescription: React.FC<Props> = ({
  data,
}) => {
  switch (data.action) {
    case "CONFIRM_JOB":
      return <ConfirmRedirectResponseDataDetailsDescription data={data} />;
    case "DELETE_JOB":
      return <DeleteRedirectResponseDataDetailsDescription data={data} />;
    default:
      throw new Error("Unexpected data provided in redirect response");
  }
};
