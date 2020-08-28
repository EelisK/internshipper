import { InternshipperClient } from "./InternshipperClient";
import { InternshipSearch } from "./types";

export const createInternshipSearch = (client: InternshipperClient) => async (
  search: InternshipSearch
) => await client.post("/jobs", search);
