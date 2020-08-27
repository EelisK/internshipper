import * as React from "react";
import { Button, Grid } from "grommet";
import {
  InternshipSearch,
  AdditionalRequestOptions,
} from "../../api/types/Internshipper";
import {
  JobiiliRequest as JobiiliRequestType,
  JobiiliProvince,
  JobiiliOrganization,
  JobiiliDegreeTitle,
} from "../../api/types";
import { JobiiliRequest } from "./JobiiliRequest";
import { AdditionalFilters } from "./AdditionalFilters";
import { JobiiliLogin } from "./JobiiliLogin";
import { Notification } from "./Notification";
import { StyledForm } from "./styled";

export type ReadableJobiiliRequest = Omit<
  JobiiliRequestType,
  "regions" | "organization" | "jobTargetDegrees" | "jobClasses"
> & {
  provinces: JobiiliProvince[];
  organization: JobiiliOrganization | null;
  jobTargetDegrees: JobiiliDegreeTitle[];
  jobClasses: JobiiliDegreeTitle[];
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

export class InternshipForm extends React.PureComponent<Props, State> {
  state: State = getInitialState();
  render() {
    return (
      <StyledForm onSubmit={this.onSubmit}>
        <Notification
          email={this.state.internshipSearchQuery.email}
          setUserContactInfo={this.partialUpdateInternshipQuery}
        />
        <JobiiliLogin
          user={this.state.internshipSearchQuery.user}
          password={this.state.internshipSearchQuery.password}
          setCredentials={this.partialUpdateInternshipQuery}
        />
        <Grid
          areas={[
            // start: [column, row]
            { name: "freeform", start: [0, 1], end: [0, 1] },
            { name: "profession", start: [0, 0], end: [0, 0] },
            { name: "timeAndPlace", start: [1, 0], end: [1, 0] },
            { name: "jobiiliToggles", start: [1, 1], end: [1, 1] },
          ]}
          columns={["flex", "flex"]}
          rows={["medium", "small"]}
          gap="small"
        >
          <JobiiliRequest
            request={this.state.request}
            setRequest={(request) => this.setState({ request })}
          />
          <AdditionalFilters
            options={this.state.options}
            setAdditionalOptions={(options) => this.setState({ options })}
          />

          <Button primary type="submit" label="Find" />
        </Grid>
      </StyledForm>
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
    const {
      provinces,
      organization,
      jobTargetDegrees,
      jobClasses,
      ...partialRequest
    } = this.state.request;
    const request: JobiiliRequestType = {
      ...partialRequest,
      regions: provinces.map((x) => x.name),
      organization: organization?.id,
      jobTargetDegrees: jobTargetDegrees.map((x) => x.id),
      jobClasses: jobClasses.map((x) => x.id),
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
