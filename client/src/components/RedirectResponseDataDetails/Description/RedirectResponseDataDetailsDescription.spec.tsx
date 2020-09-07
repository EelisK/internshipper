import * as React from "react";
import {
  RedirectResponseDataDetailsDescription,
  Props,
} from "./RedirectResponseDataDetailsDescription";
import { shallow } from "enzyme";
import { ConfirmRedirectResponseDataDetailsDescription } from "./ConfirmRedirectResponseDataDetailsDescription";
import { DeleteRedirectResponseDataDetailsDescription } from "./DeleteRedirectResponseDataDetailsDescription";

describe("<RedirectResponseDataDetailsDescription />", () => {
  const getProps = (options: Partial<Props["data"]> = {}): Props => ({
    data: {
      action: "DELETE_JOB",
      payload: {} as any,
      ...options,
    },
  });
  describe.each`
    action           | ExpectedComponent
    ${"CONFIRM_JOB"} | ${ConfirmRedirectResponseDataDetailsDescription}
    ${"DELETE_JOB"}  | ${DeleteRedirectResponseDataDetailsDescription}
  `("when action is $action", ({ action, ExpectedComponent }) => {
    it("should render the correct component", () => {
      const component = shallow(
        <RedirectResponseDataDetailsDescription {...getProps({ action })} />
      );
      expect(component.find(ExpectedComponent).length).toBe(1);
    });
  });
});
