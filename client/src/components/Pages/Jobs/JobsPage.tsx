import * as React from "react";
import { Box, Layer, Footer, Anchor } from "grommet";
import { Github } from "grommet-icons";
import { InternshipForm } from "../../InternshipForm";
import {
  useRedirectResponseData,
  RequestStateContext,
  RequestState,
} from "../../../providers";
import { RedirectResponseDataDetails } from "../../RedirectResponseDataDetails";
import { StateOverlay } from "../../StateOverlay";
import { StyledMain } from "./styles";

const GITHUB_SOURCE_LINK = "https://github.com/EelisK/internshipper";

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
      <StyledMain align="center" pad="large">
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
      </StyledMain>
      <Footer justify="center">
        <Box justify="center" pad="small" direction="row">
          <Box>
            <Anchor
              icon={<Github />}
              href={GITHUB_SOURCE_LINK}
              target="_blank"
              label="View my source"
              color="placeholder"
            />
          </Box>
        </Box>
      </Footer>
    </RequestStateContext.Provider>
  );
};
