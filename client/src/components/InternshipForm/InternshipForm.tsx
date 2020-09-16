import * as React from "react";
import { Button, Grid, Header, Box, Text, ResponsiveContext } from "grommet";
import { Plan, Technology } from "grommet-icons";
import { InternshipperData, AdditionalRequestOptions } from "../../api/types";
import { ReadableJobiiliRequest } from "./types";
import { JobiiliRequest } from "./JobiiliRequest";
import { AdditionalFilters } from "./AdditionalFilters";
import { JobiiliLogin } from "./JobiiliLogin";
import { Notification } from "./Notification";
import { StyledForm } from "./styles";

export interface Props {
  onSubmit: () => Promise<any>;
  updateInternshipQuery: (update: Partial<InternshipperData>) => any;
  updateJobiiliRequest: (request: Partial<ReadableJobiiliRequest>) => any;
  updateOptions: (options: Partial<AdditionalRequestOptions>) => any;
  internshipSearchQuery: InternshipperData;
  request: ReadableJobiiliRequest;
  options: AdditionalRequestOptions;
}

export const InternshipForm: React.FC<Props> = (props) => {
  const size = React.useContext(ResponsiveContext);
  const isMobileView = size === "small";
  const formGrid = [
    { name: "freeform", start: [0, 1], end: [0, 1] },
    { name: "profession", start: [0, 0], end: [0, 0] },
    { name: "timeAndPlace", start: [1, 0], end: [1, 0] },
    { name: "jobiiliToggles", start: [1, 1], end: [1, 1] },
  ];
  const gridColumns = ["flex", "flex"];
  const gridRows = ["flex", "small"];
  const RequestContainer = isMobileView ? Box : Grid;
  const requestContainerProps = isMobileView
    ? {}
    : {
        areas: formGrid,
        columns: gridColumns,
        rows: gridRows,
        gap: "small",
      };

  return (
    <StyledForm onSubmit={props.onSubmit}>
      <Header pad="large">
        <Box direction="row" pad={{ horizontal: "large", vertical: "none" }}>
          <Box pad="medium" flex="shrink" justify="center">
            <Plan />
          </Box>
          <Box pad="medium">
            <Text size="xlarge" color="brand">
              Contact
            </Text>
            <Text>Fill in your information to receive updates</Text>
          </Box>
        </Box>
      </Header>
      <Notification
        email={props.internshipSearchQuery.email}
        setUserContactInfo={props.updateInternshipQuery}
      />
      <JobiiliLogin
        user={props.internshipSearchQuery.user}
        password={props.internshipSearchQuery.password}
        setCredentials={props.updateInternshipQuery}
      />

      <Header pad="large">
        <Box direction="row" pad={{ horizontal: "large", vertical: "xsmall" }}>
          <Box pad="medium" flex="shrink" justify="center">
            <Technology />
          </Box>
          <Box pad="medium">
            <Text size="large" color="brand">
              Position
            </Text>
            <Text>
              Create the criteria for your desired internship position
            </Text>
          </Box>
        </Box>
      </Header>
      <RequestContainer {...requestContainerProps}>
        <JobiiliRequest
          request={props.request}
          setRequest={props.updateJobiiliRequest}
        />
        <AdditionalFilters
          options={props.options}
          setAdditionalOptions={props.updateOptions}
        />
      </RequestContainer>
      <Box pad={{ horizontal: "small", vertical: "xlarge" }}>
        <Button primary type="submit" label="Find" />
      </Box>
    </StyledForm>
  );
};
