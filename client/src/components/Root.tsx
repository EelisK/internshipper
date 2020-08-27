import * as React from "react";
import { InternshipperClientContext } from "../providers";
import { InternshipperClient } from "../api/InternshipperClient";
import { Grommet } from "grommet";
import { theme } from "../config/theme";
import { GlobalContainer } from "./GlobalContainer";
import { JobsPage } from "./Pages/Jobs";

const internshipperClient = new InternshipperClient();

export const Root: React.FC = () => (
  <InternshipperClientContext.Provider value={{ client: internshipperClient }}>
    <Grommet theme={theme} full>
      <GlobalContainer>
        <JobsPage />
      </GlobalContainer>
    </Grommet>
  </InternshipperClientContext.Provider>
);
