import * as React from "react";
import { Main, Box, Layer } from "grommet";
import { InternshipForm } from "../../InternshipForm";
import {
  useRedirectResponseData,
  RequestStateContext,
  RequestState,
} from "../../../providers";
import { RedirectResponseDataDetails } from "../../RedirectResponseDataDetails";
import { StateOverlay } from "../../StateOverlay";

export const JobsPage: React.FC = () => {
  const data = useRedirectResponseData();
  const [isDetailsLayerVisible, setIsDetailsLayerVisible] = React.useState<
    boolean
  >(data !== null);
  const [requestState, setRequestState] = React.useState<RequestState>({
    status: "idle",
  });

  return (
    <RequestStateContext.Provider
      value={{ state: requestState, setState: setRequestState }}
    >
      <Main align="center" pad="large">
        <Box pad="medium" elevation="medium" style={{ minHeight: "auto" }}>
          {isDetailsLayerVisible && data && (
            <Layer onClickOutside={() => setIsDetailsLayerVisible(false)}>
              <RedirectResponseDataDetails
                onClose={() => setIsDetailsLayerVisible(false)}
                data={data}
              />
            </Layer>
          )}
          <StateOverlay>
            <InternshipForm />
          </StateOverlay>
        </Box>
      </Main>
    </RequestStateContext.Provider>
  );
};
