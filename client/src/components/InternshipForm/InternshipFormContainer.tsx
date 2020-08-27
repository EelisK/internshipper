import * as React from "react";
import { createInternshipSearch } from "../../api/internshipperApi";
import { useInternshipperClient } from "../../providers";
import { InternshipForm, Props } from "./InternshipForm";

export type WrapperProps = Omit<Props, "onSubmit">;

export const InternshipFormContainer: React.FC<WrapperProps> = (props) => {
  const client = useInternshipperClient();
  return (
    <InternshipForm onSubmit={createInternshipSearch(client)} {...props} />
  );
};
