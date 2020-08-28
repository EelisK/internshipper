import { ReadableJobiiliRequest } from "./types";
import { JobiiliRequest } from "../../api/types";

export const transformReadableJobiiliRequest = (
  readableRequest: ReadableJobiiliRequest
): JobiiliRequest => {
  const {
    provinces,
    organization,
    jobTargetDegrees,
    jobClasses,
    ...partialRequest
  } = readableRequest;
  const request: JobiiliRequest = {
    ...partialRequest,
    regions: provinces.map((x) => x.name),
    organization: organization?.id,
    jobTargetDegrees: jobTargetDegrees.map((x) => x.id),
    jobClasses: jobClasses.map((x) => x.id),
  };
  return request;
};
