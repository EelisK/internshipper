import { JobiiliRequest } from "./Jobiili";

export interface AdditionalRequestOptions {
  exclude_advanced_students: boolean;
}

export interface InternshipSearch extends UserCredentials, UserContactInfo {
  request: JobiiliRequest;
  options?: AdditionalRequestOptions;
}

export interface UserContactInfo {
  email: string;
}

export interface UserCredentials {
  password: string;
  user: string;
}
