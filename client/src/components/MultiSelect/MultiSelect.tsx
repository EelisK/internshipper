import * as React from "react";
import { Select } from "grommet";
import { getSearchableString } from "./util";

export interface Props<T extends object> {
  options: T[];
  values: T[];
  labelKey: string;
  valueKey: string;
  setValues: (values: T[]) => any;
  getChanges?: (option: T) => T[];
  formatMultiple?: (values: T[]) => string;
  disableSearch?: boolean;
  icon?: React.ReactNode;
}

export interface State {
  search: string;
}

export class MultiSelect<T extends object> extends React.PureComponent<
  Props<T>,
  State
> {
  state: State = {
    search: "",
  };

  render() {
    const {
      values,
      options,
      labelKey,
      valueKey,
      icon,
      disableSearch,
      getChanges,
      setValues,
    } = this.props;

    return (
      <Select
        plain
        multiple
        closeOnChange={false}
        labelKey={labelKey}
        valueKey={valueKey}
        icon={icon}
        onSearch={
          disableSearch ? undefined : (search) => this.setState({ search })
        }
        // @ts-ignore
        options={options.filter((option) =>
          // @ts-ignore
          getSearchableString(option[valueKey]).includes(
            getSearchableString(this.state.search)
          )
        )}
        messages={{
          multiple: (this.props.formatMultiple || this.defaultGetMessage)(
            values
          ),
        }}
        value={values}
        onChange={({ option }: { option: T }) => {
          this.setState({ search: "" });
          const newValues = (getChanges || this.defaultGetChanges)(option);
          setValues(newValues);
        }}
      />
    );
  }

  private defaultGetChanges = (option: T): T[] => {
    const values = this.props.values;
    if (values.includes(option)) return values.filter((x) => x !== option);
    else return [...values, option];
  };

  private defaultGetMessage = (values: T[]): string =>
    values
      // @ts-ignore
      .map((value) => value[this.props.labelKey])
      .join(", ");
}
