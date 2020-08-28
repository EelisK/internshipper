import * as React from "react";
import { Button, Grid } from "grommet";
import { InternshipperData, AdditionalRequestOptions } from "../../api/types";
import { ReadableJobiiliRequest } from "./types";
import { JobiiliRequest } from "./JobiiliRequest";
import { AdditionalFilters } from "./AdditionalFilters";
import { JobiiliLogin } from "./JobiiliLogin";
import { Notification } from "./Notification";
import { StyledForm } from "./styled";

export interface Props {
  onSubmit: () => Promise<any>;
  updateInternshipQuery: (update: Partial<InternshipperData>) => any;
  updateJobiiliRequest: (request: Partial<ReadableJobiiliRequest>) => any;
  updateOptions: (options: Partial<AdditionalRequestOptions>) => any;
  internshipSearchQuery: InternshipperData;
  request: ReadableJobiiliRequest;
  options: AdditionalRequestOptions;
}

export class InternshipForm extends React.PureComponent<Props> {
  render() {
    return (
      <StyledForm onSubmit={this.props.onSubmit}>
        <Notification
          email={this.props.internshipSearchQuery.email}
          setUserContactInfo={this.props.updateInternshipQuery}
        />
        <JobiiliLogin
          user={this.props.internshipSearchQuery.user}
          password={this.props.internshipSearchQuery.password}
          setCredentials={this.props.updateInternshipQuery}
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
            request={this.props.request}
            setRequest={this.props.updateJobiiliRequest}
          />
          <AdditionalFilters
            options={this.props.options}
            setAdditionalOptions={this.props.updateOptions}
          />

          <Button primary type="submit" label="Find" />
        </Grid>
      </StyledForm>
    );
  }
}
