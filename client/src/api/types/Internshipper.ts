import { JobiiliRequest, JobiiliResponse } from "./Jobiili";
import { AdditionalFilters } from "../../components/InternshipForm/AdditionalFilters";

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

export type RedirectResponseData =
  | DeleteRedirectResponseData
  | ConfirmRedirectResponseData;

export interface BaseRedirectResponseData {
  action: string;
}

export interface DeleteRedirectResponseData extends BaseRedirectResponseData {
  action: "DELETE_JOB";
  payload: InternshipSearchResult;
}

export interface ConfirmRedirectResponseData extends BaseRedirectResponseData {
  action: "CONFIRM_JOB";
  payload: InternshipSearchResult;
}

export interface InternshipSearchResult {
  id: string;
  created_at: number;
  found_jobs: JobiiliResponse[];
  options?: AdditionalFilters;
  request: JobiiliRequest;
}
