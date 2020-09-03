export interface JobiiliRequest {
  combo: string | null;
  comboEmployeeNameOnly: boolean | null;
  jobClasses: number[];
  jobTargetDegrees: number[];
  languages: JobiiliLanguage[];
  regions: string[];
  municipalities: string[];
  organization: number | null;
  page: number; // TODO: backend counterpart
  startDate: string;
  endDate: string;
  types: []; // TODO:
  tags: []; // TODO:
  minLength: number;
  continous: boolean;
  onlyFreeWeeks: boolean;
  orderBy: keyof JobiiliResponse;
  reverse: boolean;
}

export interface JobiiliSchool {
  id: number;
  name: string;
  nameSwe: string | null;
  abbreviation: string;
}

export type JobiiliOrganizationType = "company";

export interface JobiiliOrganization {
  id: number;
  type: JobiiliOrganizationType;
  name: string;
  abbreviation: string;
  address: string;
  zip: string;
  city: string;
}

export interface JobiiliProvince {
  name: string;
  name_sv: string;
  name_en: string;
}

export interface JobiiliMunicipality {
  name: string;
  name_sv: string;
  name_en: string;
  region: string;
}

export interface JobiiliDegreeTitle {
  id: number;
  type: string;
  name: string;
  name_sv: string;
  name_en: string;
  deleted: boolean;
  extraInfo: string | null;
  // Meta degree titles has non-null misc values
  misc: JobiiliDegreeTitleMisc | null;
}

export interface JobiiliDegreeTitleMisc {
  maxPoints: string;
  jobClasses: number[];
}

export interface JobiiliResponse {
  id: number;
  authorId: number;
  endDate: string;
  minPeriod: number;
  organizationId: number;
  startDate: number;
  status: "published" | string; // TODO:
  maxTotalPersons: number | null;
  primarySchools: JobiiliSchool[];
  jobName: string | null;
  advancedStudentsOnly: boolean | null;
  orgName: string | null;
  orgAbbreviation: string | null;
  jobWeeks: string;
  totalStudents: string;
  availability: number[];
  publicationDate: string;
  publicationDate2: string;
  publicationEndDate: string;
  total: string;
}

export interface JobiiliLanguage {
  id: string;
  name: string;
  name_sv: string;
  name_en: string;
}
