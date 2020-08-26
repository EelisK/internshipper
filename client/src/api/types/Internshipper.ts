import { JobiiliRequest } from "./Jobiili";

export interface AdditionalRequestOptions {
  exclude_advanced_students: boolean;
}

export interface InternshipSearch {
  request: JobiiliRequest;
  password: string;
  email: string;
  user: string;
  options?: AdditionalRequestOptions;
}
