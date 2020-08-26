import * as React from "react";
import { InternshipperClientContext } from "../providers";
import { InternshipperClient } from "../api/InternshipperClient";

const internshipperClient = new InternshipperClient();

export const Root: React.FC = () => (
  <InternshipperClientContext.Provider value={{ client: internshipperClient }}>
    <h1>the application</h1>
  </InternshipperClientContext.Provider>
);
