import * as internshipperApi from "./internshipperApi";
import { HttpClient } from "./HttpClient";
import { InternshipSearch } from "./types";

describe("internshipperApi", () => {
  let mockClient: HttpClient;
  beforeEach(() => {
    mockClient = {
      get: jest.fn(),
      post: jest.fn(),
    };
  });

  describe("createInternshipSearch", () => {
    it("should call client.post with the provided job request", async () => {
      const request: InternshipSearch = {
        email: "foo@bar.com",
        password: "password123",
        user: "user",
        request: {} as any,
      };
      await internshipperApi.createInternshipSearch(mockClient as any)(request);
      expect(mockClient.post).toHaveBeenCalledTimes(1);
      expect(mockClient.post).toHaveBeenCalledWith("/jobs", request);
    });
  });
});
