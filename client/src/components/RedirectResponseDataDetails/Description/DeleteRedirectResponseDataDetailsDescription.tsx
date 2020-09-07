import * as React from "react";
import { formatDistance } from "date-fns";
import { Text } from "grommet";
import { DeleteRedirectResponseData } from "../../../api/types";

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
