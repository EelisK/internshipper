import * as React from "react";
import { shallow } from "enzyme";
import { Notification, Props } from "./Notification";
import { TextInput } from "grommet";

describe("<Notification />", () => {
  const getProps = (options: Partial<Props> = {}): Props => ({
    email: "",
    setUserContactInfo: jest.fn(),
    ...options,
  });

  it("should render an input field for an email address", () => {
    const component = shallow(<Notification {...getProps()} />);
    expect(component.find(TextInput).length).toBe(1);
    expect(component.find(TextInput).prop("type")).toBe("email");
  });

  it("should call setUserContactInfo when the email input changes", () => {
    const props = getProps();
    const component = shallow(<Notification {...props} />);
    component
      .find(TextInput)
      .simulate("change", { target: { value: "foo@bar.com" } });
    expect(props.setUserContactInfo).toHaveBeenCalledWith({
      email: "foo@bar.com",
    });
  });
});
