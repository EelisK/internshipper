import * as React from "react";
import { shallow } from "enzyme";
import { AdditionalFilters, Props } from "./AdditionalFilters";
import { CheckBox } from "grommet";

describe("<AdditionalFilters />", () => {
  const getProps = (options: Partial<Props> = {}): Props => ({
    options: { exclude_advanced_students: false },
    setAdditionalOptions: jest.fn(),
    ...options,
  });

  it("should render a checkbox", () => {
    const component = shallow(<AdditionalFilters {...getProps()} />);
    expect(component.find(CheckBox).length).toBe(1);
    expect(component.prop("label")).toEqual("Exclude advanced students");
  });

  it("should set the checked prop based on exclude_advanced_students", () => {
    const props = getProps({ options: { exclude_advanced_students: true } });
    const component = shallow(<AdditionalFilters {...props} />);
    expect(component.prop("checked")).toBe(true);
    component.setProps({
      ...props,
      options: { exclude_advanced_students: false },
    });
    expect(component.prop("checked")).toBe(false);
  });

  it("should call setAdditionalOptions when the value changes", () => {
    const props = getProps({ options: { exclude_advanced_students: true } });
    const component = shallow(<AdditionalFilters {...props} />);
    component.simulate("change", { target: { checked: false } });
    expect(props.setAdditionalOptions).toHaveBeenCalledTimes(1);
    expect(props.setAdditionalOptions).toHaveBeenCalledWith({
      exclude_advanced_students: false,
    });
  });
});
