import * as React from "react";
import { shallow } from "enzyme";
import { GlobalContainer } from "./GlobalContainer";

describe("<GlobalContainer />", () => {
  it("should render a box with 100% height", () => {
    const component = shallow(<GlobalContainer>foo</GlobalContainer>);
    expect(component.prop("height")).toEqual("100%");
    expect(component.text()).toEqual("foo");
  });
});
