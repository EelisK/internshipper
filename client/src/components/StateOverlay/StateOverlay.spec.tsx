import * as React from "react";
import { Props, StateOverlay } from "./StateOverlay";
import { shallow } from "enzyme";
import { Box, Text } from "grommet";

describe("<StateOverlay />", () => {
  const DummyComponent: React.FC = () => null;
  const getProps = (options: Partial<Props> = {}): Props => ({
    children: <DummyComponent />,
    state: { status: "idle" },
    ...options,
  });

  describe("idle state", () => {
    it("should render a plain box and children", () => {
      const component = shallow(
        <StateOverlay {...getProps({ state: { status: "idle" } })} />
      );
      expect(component.find(Box).prop("style")).toMatchObject({});
      expect(component.find(Box).dive().find(DummyComponent).length).toBe(1);
    });
  });

  describe("loading state", () => {
    it("should render a container box with opacity", () => {
      const component = shallow(
        <StateOverlay {...getProps({ state: { status: "loading" } })} />
      );
      expect(component.find(Box).prop("style")).toMatchObject({
        opacity: expect.any(Number),
      });
    });
  });

  describe("error state", () => {
    it("should initially render the error", () => {
      const props = getProps({
        state: { status: "error", error: new Error("Boom!") },
      });
      const component = shallow(<StateOverlay {...props} />);
      expect(component.find(Text).length).toBe(1);
      expect(component.find(Text).text()).toEqual("Boom!");
    });
    describe("when closing the error details", () => {
      it("should close the details", () => {
        const props = getProps({
          state: { status: "error", error: new Error("Boom!") },
        });
        const component = shallow(<StateOverlay {...props} />);
        const closeComponent = component.find(Box).at(3);
        closeComponent.simulate("click");
        expect(component.find(Text).length).toBe(0);
      });
    });
  });
});
