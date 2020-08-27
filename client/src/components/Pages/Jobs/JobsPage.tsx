import * as React from "react";
import { InternshipForm } from "../../InternshipForm";
import { Main } from "grommet";

export interface Props {}

export const JobsPage: React.FC<Props> = () => (
  <Main flex align="center" pad="large">
    <InternshipForm />
  </Main>
);
