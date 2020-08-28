import * as React from "react";
import { UserContactInfo } from "../../../api/types";
import { TextInput, FormField, Box, Grid } from "grommet";
import { Mail } from "grommet-icons";

export interface Props extends UserContactInfo {
  setUserContactInfo: (contactInfo: UserContactInfo) => any;
}

export const Notification: React.FC<Props> = (props) => {
  const getOnChangeListener = (property: keyof UserContactInfo) => (
    event: React.ChangeEvent<any>
  ) => {
    const {
      setUserContactInfo: onUserContactInfoChange,
      ...contactInfo
    } = props;
    const value = event.target.value;
    onUserContactInfoChange({ ...contactInfo, [property]: value });
  };

  return (
    <Grid
      areas={[{ name: "center", start: [1, 0], end: [1, 0] }]}
      columns={["xsmall", "flex", "xsmall"]}
      rows={["xsmall"]}
      gap="small"
    >
      <Box gridArea="center">
        <FormField label="Email address">
          <TextInput
            onChange={getOnChangeListener("email")}
            value={props.email}
            type="email"
            icon={<Mail />}
            required
          />
        </FormField>
      </Box>
    </Grid>
  );
};
