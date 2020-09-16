import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { JobiiliRequest, Props } from "./JobiiliRequest";
import { ReadableJobiiliRequest } from "../types";
import { MultiSelect } from "../../MultiSelect";
import { FormField, Select, TextInput, DateInput, CheckBox } from "grommet";
import { JobiiliDegreeTitle } from "../../../api/types";

const getRequest = (
  options: Partial<ReadableJobiiliRequest> = {}
): ReadableJobiiliRequest => ({
  jobClasses: [],
  jobTargetDegrees: [],
  languages: [],
  combo: null,
  comboEmployeeNameOnly: null,
  provinces: [],
  onlyFreeWeeks: true,
  municipalities: [],
  organization: null,
  page: 1,
  startDate: "2020-08-03T00:00:00-12:00",
  endDate: "2020-12-20T00:00:00-12:00",
  types: [],
  tags: [],
  minLength: 5,
  continous: true,
  orderBy: "publicationDate",
  reverse: true,
  ...options,
});

describe("<JobiiliRequest />", () => {
  const getProps = (options: Partial<Props> = {}): Props => ({
    request: getRequest(),
    setRequest: jest.fn(),
    ...options,
  });

  // renderDegreeRelatedFields
  it("should render a MultiSelect for language", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(FormField).at(0).prop("label")).toEqual(
      "Guidance languages"
    );
    expect(component.find(FormField).at(0).find(MultiSelect).length).toBe(1);
  });

  it("should render a required MultiSelect for degree title", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(FormField).at(1).prop("label")).toEqual(
      "Degree titles"
    );
    expect(component.find(FormField).at(1).find(MultiSelect).length).toBe(1);
    expect(component.find(FormField).at(1).prop("validate")).toBeInstanceOf(
      Function
    );
  });

  it("should render a required MultiSelect for practice classification", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(FormField).at(2).prop("label")).toEqual(
      "Practice classification"
    );
    expect(component.find(FormField).at(2).find(MultiSelect).length).toBe(1);
    expect(component.find(FormField).at(2).prop("validate")).toBeInstanceOf(
      Function
    );
  });

  describe("when selecting meta practice classifications", () => {
    const metaClassificationSample: JobiiliDegreeTitle = {
      id: 300,
      type: "targetDegree",
      name: "Kaikki Apuvälineteknikko, apuneuvoteknikko",
      name_sv: "Kaikki Hjälpmedelstekniker",
      name_en: "Kaikki Prosthetist-Orthotist",
      deleted: false,
      extraInfo: "671115",
      misc: { maxPoints: "210", jobClasses: [377] },
    };
    const associatedClassifications: JobiiliDegreeTitle[] = [
      {
        id: 377,
        type: "jobClass",
        name: "Apuvälinetekniikka",
        name_sv: "Hjälpmedelsteknologi",
        name_en: "Prosthetics and orthotics technology",
        deleted: false,
        extraInfo: null,
        misc: null,
      },
    ];
    const getClassificationSelect = (component: ShallowWrapper<Props>) =>
      component.find(FormField).at(2).find(MultiSelect);

    it("should render filter the meta classes out of the message", () => {
      const props = getProps({
        request: getRequest({
          jobClasses: [metaClassificationSample, ...associatedClassifications],
        }),
      });
      const component = shallow(<JobiiliRequest {...props} />);
      const internalSelect = getClassificationSelect(component)
        .dive()
        .find(Select);

      expect(internalSelect.prop("messages")).toMatchObject({
        multiple: "Apuvälinetekniikka",
      });
    });
  });

  it("should render a Select for available organizations", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(FormField).at(3).prop("label")).toEqual("Employee");
    expect(component.find(FormField).at(3).find(Select).length).toBe(1);
  });

  // renderTimeAndPlaceFormFields
  it("should render a MultiSelect for province", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(FormField).at(4).prop("label")).toEqual("Province");
    expect(component.find(FormField).at(4).find(MultiSelect).length).toBe(1);
  });

  it("should render a MultiSelect for municipality", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(FormField).at(5).prop("label")).toEqual(
      "Municipality"
    );
    expect(component.find(FormField).at(5).find(MultiSelect).length).toBe(1);
  });

  it("should render a numeric TextInput for minimum internship length", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(FormField).at(6).prop("label")).toEqual(
      "Minimum length of internship in weeks"
    );
    expect(component.find(FormField).at(6).find(TextInput).length).toBe(1);
    expect(component.find(FormField).at(6).find(TextInput).prop("type")).toBe(
      "number"
    );
  });

  it("should render a DateInput for end date", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(FormField).at(7).prop("label")).toEqual("From");
    expect(component.find(FormField).at(7).find(DateInput).length).toBe(1);
  });

  it("should render a DateInput for start date", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(FormField).at(8).prop("label")).toEqual("To");
    expect(component.find(FormField).at(8).find(DateInput).length).toBe(1);
  });

  // renderFreeformSearch
  it("should render a TextInput for text search", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(FormField).at(9).prop("label")).toEqual(
      "Text search"
    );
    expect(component.find(FormField).at(9).find(TextInput).length).toBe(1);
  });

  it("should render a CheckBox for speciying the search type", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(CheckBox).at(0).prop("label")).toEqual(
      "Text search only on employers' name"
    );
  });

  // renderJobiiliToggles
  it("should render a CheckBox for toggling a continuous period", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(CheckBox).at(1).prop("label")).toEqual(
      "Continuous period only"
    );
  });

  it("should render a CheckBox for specifying only available placements", () => {
    const component = shallow(<JobiiliRequest {...getProps()} />);
    expect(component.find(CheckBox).at(2).prop("label")).toEqual(
      "Only placements still available"
    );
  });
});
