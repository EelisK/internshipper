import * as React from "react";
import { AdditionalRequestOptions } from "../../../api/types";
import { CheckBox } from "grommet";

export interface Props {
  options: AdditionalRequestOptions;
  setAdditionalOptions: (options: AdditionalRequestOptions) => any;
}

export class AdditionalFilters extends React.PureComponent<Props> {
  render() {
    return (
      <CheckBox
        required
        checked={this.props.options.exclude_advanced_students}
        label="Exclude advanced students"
        onChange={(event) =>
          this.props.setAdditionalOptions({
            ...this.props.options,
            exclude_advanced_students: event.target.checked,
          })
        }
      />
    );
  }
}
