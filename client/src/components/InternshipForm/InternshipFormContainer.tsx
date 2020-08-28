import * as React from "react";
import { createInternshipSearch } from "../../api/internshipperApi";
import { useInternshipperClient } from "../../providers";
import { InternshipForm } from "./InternshipForm";
import {
  AdditionalRequestOptions,
  InternshipSearch,
  InternshipperData,
} from "../../api/types";
import { transformReadableJobiiliRequest } from "./util";
import { ReadableJobiiliRequest } from "./types";

export interface Props {
  createInternshipSearch: ReturnType<typeof createInternshipSearch>;
}

export interface State {
  internshipSearchQuery: InternshipperData;
  request: ReadableJobiiliRequest;
  options: AdditionalRequestOptions;
}

const getInitialState = (): State => ({
  request: {
    orderBy: "publicationDate",
    reverse: true,
    types: [],
    tags: [],

    combo: "",
    comboEmployeeNameOnly: false,

    continous: false,
    onlyFreeWeeks: false,
    organization: null,

    endDate: new Date().toISOString(),
    startDate: new Date().toISOString(),

    jobClasses: [],
    municipalities: [],
    jobTargetDegrees: [],
    languages: [],
    minLength: 0,
    page: 0,
    provinces: [],
  },
  options: {
    exclude_advanced_students: false,
  },
  internshipSearchQuery: {
    email: "",
    password: "",
    user: "",
  },
});

export class InternshipFormContainer extends React.PureComponent<Props, State> {
  state: State = getInitialState();
  render() {
    return (
      <InternshipForm
        onSubmit={this.onSubmit}
        updateInternshipQuery={this.updateInternshipQuery}
        updateJobiiliRequest={this.updateJobiiliRequest}
        updateOptions={this.updateOptions}
        {...this.state}
      />
    );
  }

  private onSubmit = async () => {
    const internshipSearch: InternshipSearch = {
      ...this.state.internshipSearchQuery,
      options: this.state.options,
      request: transformReadableJobiiliRequest(this.state.request),
    };
    await this.props.createInternshipSearch(internshipSearch);
    this.setState(getInitialState());
  };

  private updateInternshipQuery = (
    update: Partial<State["internshipSearchQuery"]>
  ) =>
    this.setState((prevState) => {
      return {
        internshipSearchQuery: {
          ...prevState.internshipSearchQuery,
          ...update,
        },
      };
    });

  private updateJobiiliRequest = (update: Partial<ReadableJobiiliRequest>) =>
    this.setState((prevState) => {
      return {
        request: {
          ...prevState.request,
          ...update,
        },
      };
    });

  private updateOptions = (update: Partial<AdditionalRequestOptions>) =>
    this.setState((prevState) => {
      return {
        options: {
          ...prevState.options,
          ...update,
        },
      };
    });
}

export type WrapperProps = Omit<Props, "createInternshipSearch">;

export const InternshipFormContainerWrapper: React.FC<WrapperProps> = (
  props
) => {
  const client = useInternshipperClient();
  return (
    <InternshipFormContainer
      createInternshipSearch={createInternshipSearch(client)}
      {...props}
    />
  );
};
