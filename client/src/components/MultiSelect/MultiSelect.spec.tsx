import * as React from "react";
import { shallow } from "enzyme";
import { MultiSelect, Props } from "./MultiSelect";
import { Select } from "grommet";

describe("<MultiSelect />", () => {
  type TestObject = { label: string; value: string };
  const getProps = (
    options: Partial<Props<TestObject>> = {}
  ): Props<TestObject> => ({
    labelKey: "label",
    valueKey: "value",
    options: [],
    values: [],
    setValues: jest.fn(),
    ...options,
  });

  it("should render a Select component", () => {
    const component = shallow(<MultiSelect {...getProps()} />);
    expect(component.find(Select).length).toBe(1);
  });

  it("should render an icon component when one is provided", () => {
    const MockIcon: React.FC = () => <>foo</>;
    const icon = <MockIcon />;
    const component = shallow(<MultiSelect {...getProps({ icon })} />);
    expect(component.prop("icon")).toBe(icon);
  });

  it("should filter options based on the provided filter", () => {
    const props = getProps({
      options: [
        { label: "first", value: "first" },
        { label: "second", value: "second" },
      ],
    });
    const component = shallow(<MultiSelect {...props} />);
    expect(component.prop("options").length).toBe(2);
    component.setState({ search: "first" });
    expect(component.prop("options").length).toBe(1);
    component.setState({ search: "not-in-options" });
    expect(component.prop("options").length).toBe(0);
  });

  describe("when more than one value is selected", () => {
    it("should format messages with a default format", () => {
      const props = getProps({
        values: [
          { value: "1", label: "haha" },
          { value: "2", label: "brr" },
        ],
        labelKey: "label",
      });
      const component = shallow(<MultiSelect {...props} />);
      expect(component.prop("messages")).toMatchObject({
        multiple: "haha, brr",
      });
    });

    it("should render messages with the provided custom format", () => {
      const props = getProps({
        values: [
          { value: "foo", label: "foo" },
          { value: "bar", label: "bar" },
        ],
        formatMultiple: () => "custom message",
      });
      const component = shallow(<MultiSelect {...props} />);
      expect(component.prop("messages")).toMatchObject({
        multiple: "custom message",
      });
    });
  });

  describe("when an option is selected", () => {
    it("should reset the search value", () => {
      const props = getProps({
        options: [{ value: "foo", label: "foo" }],
        values: [],
      });
      const component = shallow(<MultiSelect {...props} />);
      component.simulate("change", { option: { value: "foo", label: "foo" } });
      expect(component.state()).toMatchObject({ search: "" });
    });

    it("should call setValues with the updated list", () => {
      const props = getProps({
        options: [
          { value: "foo", label: "foo" },
          { value: "bar", label: "bar" },
        ],
        values: [{ value: "foo", label: "foo" }],
      });
      const component = shallow(<MultiSelect {...props} />);
      component.simulate("change", { option: { value: "bar", label: "bar" } });
      expect(props.setValues).toHaveBeenCalledTimes(1);
      expect(props.setValues).toHaveBeenCalledWith([
        { value: "foo", label: "foo" },
        { value: "bar", label: "bar" },
      ]);
    });

    it("should apply custom changes when getChanges is passed", () => {
      const props = getProps({
        getChanges: jest
          .fn()
          .mockImplementation(() => [{ value: "value", label: "label" }]),
        setValues: jest.fn(),
      });
      const component = shallow(<MultiSelect {...props} />);
      component.simulate("change", { option: { label: "foo", value: "bar" } });
      expect(props.getChanges).toHaveBeenCalledTimes(1);
      expect(props.getChanges).toHaveBeenCalledWith({
        label: "foo",
        value: "bar",
      });
      expect(props.setValues).toHaveBeenCalledTimes(1);
      expect(props.setValues).toHaveBeenCalledWith([
        { value: "value", label: "label" },
      ]);
    });
  });
});
