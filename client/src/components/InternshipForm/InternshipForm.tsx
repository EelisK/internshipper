import * as React from "react";
import { Form, Button } from "grommet";
import {
  InternshipSearch,
  AdditionalRequestOptions,
} from "../../api/types/Internshipper";
import {
  JobiiliRequest,
  JobiiliProvince,
  JobiiliOrganization,
} from "../../api/types";
import { JobiiliRequestForm } from "./JobiiliRequestForm";
import { AdditionalFiltersForm } from "./AdditionalFiltersForm";
import { JobiiliLoginForm } from "./JobiiliLoginForm";
import { NotificationForm } from "./NotificationForm";

export type ReadableJobiiliRequest = Omit<
  JobiiliRequest,
  "regions" | "organization"
> & {
  provinces: JobiiliProvince[];
  organization: JobiiliOrganization | null;
};

export interface State {
  internshipSearchQuery: Omit<InternshipSearch, "request" | "options">;
  request: ReadableJobiiliRequest;
  options: AdditionalRequestOptions;
}

export interface Props {
  onSubmit: (request: InternshipSearch) => Promise<any>;
}

const getInitialState = (): State => ({
  request: {
    orderBy: "publicationDate",
    reverse: true,
    types: [],
    tags: [],

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

export class InternshipForm extends React.PureComponent<Props, State> {
  state: State = getInitialState();
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <NotificationForm
          email={this.state.internshipSearchQuery.email}
          setUserContactInfo={this.partialUpdateInternshipQuery}
        />
        <JobiiliLoginForm
          user={this.state.internshipSearchQuery.user}
          password={this.state.internshipSearchQuery.password}
          setCredentials={this.partialUpdateInternshipQuery}
        />

        <JobiiliRequestForm
          request={this.state.request}
          setRequest={(request) => this.setState({ request })}
        />
        <AdditionalFiltersForm
          options={this.state.options}
          setAdditionalOptions={(options) => this.setState({ options })}
        />

        <Button primary type="submit" label="Select these criteria" />
      </Form>
    );
  }

  private partialUpdateInternshipQuery = (
    update: Partial<State["internshipSearchQuery"]>
  ) => {
    this.setState((prevState) => {
      return {
        internshipSearchQuery: {
          ...prevState.internshipSearchQuery,
          ...update,
        },
      };
    });
  };

  private onSubmit = async () => {
    const { provinces, organization, ...partialRequest } = this.state.request;
    const request: JobiiliRequest = {
      ...partialRequest,
      regions: provinces.map((x) => x.name),
      organization: organization?.id,
    };
    const internshipSearch: InternshipSearch = {
      ...this.state.internshipSearchQuery,
      options: this.state.options,
      request,
    };
    await this.props.onSubmit(internshipSearch);
    this.setState(getInitialState());
  };
}
