import * as React from "react";
import { Main, Box } from "grommet";
import { InternshipForm } from "../../InternshipForm";

export interface Props {}

export const JobsPage: React.FC<Props> = () => (
  <Main align="center" pad="large">
    <Box pad="medium" elevation="medium" style={{ minHeight: "auto" }}>
      <InternshipForm />
    </Box>
  </Main>
);
