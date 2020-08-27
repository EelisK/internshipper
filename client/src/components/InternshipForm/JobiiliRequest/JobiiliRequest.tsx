import * as React from "react";
import {
  DateInput,
  Grid,
  Box,
  FormField,
  TextInput,
  Select,
  CheckBox,
  Form,
} from "grommet";
import {
  JobiiliProvince,
  JobiiliMunicipality,
  JobiiliLanguage,
  JobiiliDegreeTitle,
  JobiiliOrganization,
} from "../../../api/types";
import {
  AVAILABLE_LANGUAGES,
  AVAILABLE_PROVINCES,
  AVAILABLE_MUNICIPALITIES,
  AVAILABLE_DEGREE_TITLES,
  AVAILABLE_ORGANIZATIONS,
} from "../../../api/fixtures";
import { ReadableJobiiliRequest } from "../InternshipForm";
import {
  MapLocation,
  Location,
  Language,
  UserWorker,
  Briefcase,
} from "grommet-icons";

export interface Props {
  request: ReadableJobiiliRequest;
  setRequest: (request: ReadableJobiiliRequest) => any;
}

export interface State {
  provinceSearch: string;
  municipalitySearch: string;
}

export class JobiiliRequest extends React.PureComponent<Props, State> {
  state: State = {
    municipalitySearch: "",
    provinceSearch: "",
  };
  render() {
    return (
      <Grid
        areas={[
          // start: [column, row]
          { name: "location", start: [1, 0], end: [1, 0] },
          { name: "profession", start: [0, 0], end: [0, 0] },
          { name: "duration", start: [0, 1], end: [0, 1] },
        ]}
        columns={["flex", "flex"]}
        rows={["medium", "medium"]}
        gap="small"
      >
        <Box gridArea="profession">
          <FormField label="Guidance languages">
            <Select
              multiple
              labelKey="name"
              valueKey="name"
              icon={<Language />}
              options={AVAILABLE_LANGUAGES}
              messages={{
                multiple: this.props.request.languages
                  .map((x) => x.name)
                  .join(", "),
              }}
              value={this.props.request.languages}
              onChange={({ option }: { option: JobiiliLanguage }) => {
                this.setState({ provinceSearch: "" });
                if (this.props.request.provinces.includes(option))
                  this.partialUpdateRequest({
                    languages: this.props.request.languages.filter(
                      (x) => x !== option
                    ),
                  });
                else
                  this.partialUpdateRequest({
                    languages: [...this.props.request.languages, option],
                  });
              }}
            />
          </FormField>
          <FormField label="Degree titles">
            <Select
              multiple
              labelKey="name"
              valueKey="id"
              icon={<UserWorker />}
              options={AVAILABLE_DEGREE_TITLES}
              messages={{
                multiple: this.props.request.jobTargetDegrees
                  .map((degreeId) =>
                    AVAILABLE_DEGREE_TITLES.find((x) => x.id === degreeId)
                  )
                  .join(", "),
              }}
              value={this.props.request.jobTargetDegrees}
              onChange={({ option }: { option: JobiiliDegreeTitle }) => {
                if (this.props.request.jobTargetDegrees.includes(option.id))
                  this.partialUpdateRequest({
                    jobTargetDegrees: this.props.request.jobTargetDegrees.filter(
                      (x) => x !== option.id
                    ),
                  });
                else
                  this.partialUpdateRequest({
                    jobTargetDegrees: [
                      ...this.props.request.jobTargetDegrees,
                      option.id,
                    ],
                  });
              }}
            />
          </FormField>
          <FormField label="Employee">
            <Select
              labelKey="name"
              valueKey="id"
              icon={<Briefcase />}
              options={AVAILABLE_ORGANIZATIONS}
              value={this.props.request.organization || {}}
              onChange={({ option }: { option: JobiiliOrganization }) => {
                if (option.id === this.props.request.organization?.id)
                  this.partialUpdateRequest({
                    organization: null,
                  });
                else
                  this.partialUpdateRequest({
                    organization: option,
                  });
              }}
            />
          </FormField>
          {/* TODO: */}
          <FormField label="Practice classification">TODO</FormField>
        </Box>
        <Box gridArea="location">
          <FormField label="Province">
            <Select
              multiple
              labelKey="name"
              valueKey="name"
              icon={<MapLocation />}
              emptySearchMessage="No province found"
              onSearch={(provinceSearch) => this.setState({ provinceSearch })}
              options={AVAILABLE_PROVINCES.filter((province) =>
                this.getSearchableString(province.name).includes(
                  this.getSearchableString(this.state.provinceSearch)
                )
              )}
              messages={{
                multiple: this.props.request.provinces
                  .map((x) => x.name)
                  .join(", "),
              }}
              value={this.props.request.provinces}
              onChange={({ option }: { option: JobiiliProvince }) => {
                this.setState({ provinceSearch: "" });
                if (this.props.request.provinces.includes(option))
                  this.partialUpdateRequest({
                    provinces: this.props.request.provinces.filter(
                      (x) => x !== option
                    ),
                  });
                else
                  this.partialUpdateRequest({
                    provinces: [...this.props.request.provinces, option],
                  });
              }}
            />
          </FormField>
          <FormField label="Municipality">
            <Select
              multiple
              labelKey="name"
              valueKey="name"
              icon={<Location />}
              emptySearchMessage="No municipalities found"
              options={AVAILABLE_MUNICIPALITIES.filter((municipality) =>
                this.getSearchableString(municipality.name).includes(
                  this.getSearchableString(this.state.municipalitySearch)
                )
              )}
              messages={{
                multiple: this.props.request.municipalities
                  .map((x) => x.name)
                  .join(", "),
              }}
              value={this.props.request.municipalities}
              onSearch={(municipalitySearch) =>
                this.setState({ municipalitySearch })
              }
              onChange={({ option }: { option: JobiiliMunicipality }) => {
                this.setState({ municipalitySearch: "" });
                if (this.props.request.municipalities.includes(option))
                  this.partialUpdateRequest({
                    municipalities: this.props.request.municipalities.filter(
                      (x) => x !== option
                    ),
                  });
                else
                  this.partialUpdateRequest({
                    municipalities: [
                      ...this.props.request.municipalities,
                      option,
                    ],
                  });
              }}
            />
          </FormField>
        </Box>
        <Box gridArea="duration">
          <Box flex direction="column">
            <Box flex direction="row">
              <FormField label="Start date">
                <DateInput
                  inputProps={{ required: true }}
                  value={this.props.request.startDate}
                  format="mm/dd/yyyy"
                  onChange={({ value }: any) =>
                    this.partialUpdateRequest({ startDate: value })
                  }
                />
              </FormField>
              <FormField label="End date">
                <DateInput
                  inputProps={{ required: true }}
                  value={this.props.request.endDate}
                  format="mm/dd/yyyy"
                  onChange={({ value }: any) =>
                    this.partialUpdateRequest({ endDate: value })
                  }
                />
              </FormField>
            </Box>
            <FormField label="Miminum length of internship in weeks">
              <TextInput
                required
                type="number"
                value={this.props.request.minLength}
                onChange={this.getRequestPropertyChangeListener("minLength")}
              />
            </FormField>
            <Box flex direction="row">
              <CheckBox
                label="Continuous period only"
                checked={this.props.request.continous}
                onChange={(event) =>
                  this.partialUpdateRequest({ continous: event.target.checked })
                }
              />
              <CheckBox
                label="Only placements still available"
                checked={this.props.request.onlyFreeWeeks}
                onChange={(event) =>
                  this.partialUpdateRequest({
                    onlyFreeWeeks: event.target.checked,
                  })
                }
              />
            </Box>
          </Box>
        </Box>
      </Grid>
    );
  }

  private getRequestPropertyChangeListener = (
    property: keyof ReadableJobiiliRequest
  ) => (event: React.ChangeEvent<any>) =>
    this.partialUpdateRequest({
      [property]: event.target.value,
    });

  private partialUpdateRequest = (update: Partial<ReadableJobiiliRequest>) =>
    this.props.setRequest({ ...this.props.request, ...update });

  private getSearchableString = (search: string) => search.toLowerCase().trim();
}
