import * as React from "react";
import { Form, Button } from "grommet";
import {
  InternshipSearch,
  AdditionalRequestOptions,
} from "../../api/types/Internshipper";
import {
  JobiiliRequest as JobiiliRequestType,
  JobiiliProvince,
  JobiiliOrganization,
} from "../../api/types";
import { JobiiliRequest } from "./JobiiliRequest";
import { AdditionalFilters } from "./AdditionalFilters";
import { JobiiliLogin } from "./JobiiliLogin";
import { Notification } from "./Notification";

export type ReadableJobiiliRequest = Omit<
  JobiiliRequestType,
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
        <Notification
          email={this.state.internshipSearchQuery.email}
          setUserContactInfo={this.partialUpdateInternshipQuery}
        />
        <JobiiliLogin
          user={this.state.internshipSearchQuery.user}
          password={this.state.internshipSearchQuery.password}
          setCredentials={this.partialUpdateInternshipQuery}
        />

        <JobiiliRequest
          request={this.state.request}
          setRequest={(request) => this.setState({ request })}
        />
        <AdditionalFilters
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
    const request: JobiiliRequestType = {
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
