import * as React from "react";
import { Main, Box, Layer } from "grommet";
import { InternshipForm } from "../../InternshipForm";
import { useRedirectResponseData } from "../../../providers";
import { RedirectResponseDataDetails } from "../../RedirectResponseDataDetails";

export const JobsPage: React.FC = () => {
  const data = useRedirectResponseData();
  const [isDetailsLayerVisible, setIsDetailsLayerVisible] = React.useState<
    boolean
  >(data !== null);
  return (
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
        <InternshipForm />
      </Box>
    </Main>
  );
};
