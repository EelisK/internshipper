import * as React from "react";
import { UserCredentials } from "../../../api/types";
import { TextInput, FormField, Grid, Box } from "grommet";
import { User, Lock } from "grommet-icons";

export interface Props extends UserCredentials {
  setCredentials: (credentials: UserCredentials) => any;
}

export const JobiiliLogin: React.FC<Props> = (props) => {
  const getOnChangeListener = (property: keyof UserCredentials) => (
    event: React.ChangeEvent<any>
  ) => {
    const { setCredentials, ...credentials } = props;
    const value = event.target.value;
    setCredentials({ ...credentials, [property]: value });
  };
  return (
    <Grid
      areas={[{ name: "center", start: [1, 0], end: [1, 0] }]}
      columns={["xsmall", "flex", "xsmall"]}
      rows={["small"]}
      gap="small"
    >
      <Box gridArea="center">
        <FormField label="Metropolia username">
          <TextInput
            onChange={getOnChangeListener("user")}
            value={props.user}
            icon={<User />}
            required
          />
        </FormField>
        <FormField label="Metropolia password">
          <TextInput
            onChange={getOnChangeListener("password")}
            value={props.password}
            type="password"
            icon={<Lock />}
            required
          />
        </FormField>
      </Box>
    </Grid>
  );
};
