import { JobiiliRequest } from "./Jobiili";

export interface AdditionalRequestOptions {
  exclude_advanced_students: boolean;
}

export interface InternshipSearch extends InternshipperData {
  request: JobiiliRequest;
  options?: AdditionalRequestOptions;
}

export type InternshipperData = UserCredentials & UserContactInfo;

export interface UserContactInfo {
  email: string;
}

export interface UserCredentials {
  password: string;
  user: string;
}
