import * as React from "react";
import { UserCredentials } from "../../../api/types";
import { TextInput } from "grommet";
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
    <>
      <TextInput
        onChange={getOnChangeListener("user")}
        value={props.user}
        placeholder="username"
        icon={<User />}
        required
      />
      <TextInput
        onChange={getOnChangeListener("password")}
        value={props.password}
        placeholder="metropolia password"
        type="password"
        icon={<Lock />}
        required
      />
    </>
  );
};
