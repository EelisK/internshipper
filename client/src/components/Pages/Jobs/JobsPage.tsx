import * as React from "react";
import { Main, Box } from "grommet";
import { InternshipForm } from "../../InternshipForm";

export const JobsPage: React.FC = () => (
  <Main align="center" pad="large">
    <Box pad="medium" elevation="medium" style={{ minHeight: "auto" }}>
      <InternshipForm />
    </Box>
  </Main>
);
