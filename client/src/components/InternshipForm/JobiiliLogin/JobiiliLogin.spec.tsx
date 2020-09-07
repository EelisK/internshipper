import * as React from "react";
import { JobiiliLogin, Props } from "./JobiiliLogin";
import { shallow } from "enzyme";
import { TextInput, FormField } from "grommet";

describe("<JobiiliLogin />", () => {
  const getProps = (options: Partial<Props> = {}): Props => ({
    user: "",
    password: "",
    setCredentials: jest.fn(),
    ...options,
  });

  it("should render an input for username and password", () => {
    const component = shallow(<JobiiliLogin {...getProps()} />);
    expect(component.find(TextInput).length).toBe(2);
    expect(component.find(FormField).at(0).prop("label")).toEqual(
      "Metropolia username"
    );
    expect(component.find(FormField).at(1).prop("label")).toEqual(
      "Metropolia password"
    );
  });

  it("should update the credentials when the input is changed", () => {
    const props = getProps();
    const component = shallow(<JobiiliLogin {...props} />);
    component
      .find(TextInput)
      .at(0)
      .simulate("change", { target: { value: "foo" } });
    expect(props.setCredentials).toHaveBeenCalledTimes(1);
    expect(props.setCredentials).toHaveBeenCalledWith({
      user: "foo",
      password: "",
    });

    component.setProps({ ...props, user: "foo" });
    component
      .find(TextInput)
      .at(1)
      .simulate("change", { target: { value: "bar" } });
    expect(props.setCredentials).toHaveBeenCalledTimes(2);
    expect(props.setCredentials).toHaveBeenLastCalledWith({
      user: "foo",
      password: "bar",
    });
  });
});
