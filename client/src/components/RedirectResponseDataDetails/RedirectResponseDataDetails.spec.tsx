import * as React from "react";
import {
  RedirectResponseDataDetails,
  Props,
} from "./RedirectResponseDataDetails";
import { shallow } from "enzyme";
import { RedirectResponseDataDetailsDescription } from "./Description";
import { Button, Box } from "grommet";

describe("<RedirectResponseDataDetails />", () => {
  const getProps = (
    options: Partial<Props> = {},
    dataOptions: Partial<Props["data"]> = {}
  ): Props => ({
    data: {
      action: "DELETE_JOB",
      payload: {
        created_at: 0,
        found_jobs: [],
        id: "id",
        request: {} as any,
        options: undefined,
      },
      ...dataOptions,
    },
    onClose: jest.fn(),
    ...options,
  });

  it.each`
    action           | description
    ${"CONFIRM_JOB"} | ${"Subscription confirmed"}
    ${"DELETE_JOB"}  | ${"Job search stopped"}
  `(
    "should render a humanized title for action $action",
    ({ action, description }) => {
      const component = shallow(
        <RedirectResponseDataDetails {...getProps({}, { action })} />
      );
      expect(component.text()).toContain(description);
    }
  );

  it("should render a RedirectResponseDataDetailsDescription component", () => {
    const component = shallow(<RedirectResponseDataDetails {...getProps()} />);
    expect(component.find(RedirectResponseDataDetailsDescription).length).toBe(
      1
    );
  });

  describe("when closing the modal", () => {
    describe("using the close button", () => {
      it("should call props.onClose", () => {
        const props = getProps();
        const component = shallow(<RedirectResponseDataDetails {...props} />);
        component.find(Button).simulate("click");
        expect(props.onClose).toHaveBeenCalledTimes(1);
      });
    });
    describe("using the Close icon container", () => {
      it("should call props.onClose", () => {
        const props = getProps();
        const component = shallow(<RedirectResponseDataDetails {...props} />);
        component.find(Box).at(4).simulate("click");
        expect(props.onClose).toHaveBeenCalledTimes(1);
      });
    });
  });
});
