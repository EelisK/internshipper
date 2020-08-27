import * as React from "react";
import { UserContactInfo } from "../../../api/types";
import { TextInput } from "grommet";
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
    <TextInput
      onChange={getOnChangeListener("email")}
      value={props.email}
      placeholder="email"
      type="email"
      icon={<Mail />}
      required
    />
  );
};
