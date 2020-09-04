import { ReadableJobiiliRequest } from "./types";
import { JobiiliRequest, JobiiliDegreeTitle } from "../../api/types";

export const transformReadableJobiiliRequest = (
  readableRequest: ReadableJobiiliRequest
): JobiiliRequest => {
  const {
    provinces,
    organization,
    jobTargetDegrees,
    jobClasses,
    municipalities,
    ...partialRequest
  } = readableRequest;
  const request: JobiiliRequest = {
    ...partialRequest,
    regions: provinces.map((x) => x.name),
    organization: organization?.id,
    jobTargetDegrees: jobTargetDegrees.map((x) => x.id),
    jobClasses: jobClasses.map((x) => x.id),
    municipalities: municipalities.map((x) => x.name),
  };
  return request;
};

export const isMetaClassification = (klass: JobiiliDegreeTitle) =>
  klass.misc !== null;
