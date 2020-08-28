import {
  JobiiliRequest,
  JobiiliProvince,
  JobiiliOrganization,
  JobiiliDegreeTitle,
} from "../../api/types";

export type ReadableJobiiliRequest = Omit<
  JobiiliRequest,
  "regions" | "organization" | "jobTargetDegrees" | "jobClasses"
> & {
  provinces: JobiiliProvince[];
  organization: JobiiliOrganization | null;
  jobTargetDegrees: JobiiliDegreeTitle[];
  jobClasses: JobiiliDegreeTitle[];
};
