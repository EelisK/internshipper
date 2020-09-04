import {
  JobiiliRequest,
  JobiiliProvince,
  JobiiliOrganization,
  JobiiliDegreeTitle,
  JobiiliMunicipality,
} from "../../api/types";

export type ReadableJobiiliRequest = Omit<
  JobiiliRequest,
  | "regions"
  | "organization"
  | "jobTargetDegrees"
  | "jobClasses"
  | "municipalities"
> & {
  provinces: JobiiliProvince[];
  organization: JobiiliOrganization | null;
  municipalities: JobiiliMunicipality[];
  jobTargetDegrees: JobiiliDegreeTitle[];
  jobClasses: JobiiliDegreeTitle[];
};
