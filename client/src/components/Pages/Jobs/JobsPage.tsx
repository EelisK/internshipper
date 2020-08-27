import * as React from "react";
import { InternshipForm } from "../../InternshipForm";
import { Nav, Anchor, Main } from "grommet";
import { Mail } from "grommet-icons";

export interface Props {}

export const JobsPage: React.FC<Props> = () => (
  <Main>
    {/* <h1>TODO: add some other content than the background</h1> */}
    <InternshipForm />
  </Main>
);
