import * as React from "react";
import { differenceBy } from "lodash";
import {
  DateInput,
  Box,
  FormField,
  TextInput,
  Select,
  CheckBox,
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
  AVAILABLE_PRACTICE_CLASSIFICATIONS,
} from "../../../api/fixtures";
import { ReadableJobiiliRequest } from "../InternshipForm";
import {
  MapLocation,
  Location,
  Language,
  UserWorker,
  Briefcase,
  History,
  SearchAdvanced,
  Workshop,
} from "grommet-icons";

export interface Props {
  request: ReadableJobiiliRequest;
  setRequest: (request: ReadableJobiiliRequest) => any;
}

export interface State {
  provinceSearch: string;
  municipalitySearch: string;
  targetDegreeSearch: string;
  practiceClassificationSearch: string;
  employeeSearch: string;
}

export class JobiiliRequest extends React.PureComponent<Props, State> {
  state: State = {
    targetDegreeSearch: "",
    municipalitySearch: "",
    provinceSearch: "",
    practiceClassificationSearch: "",
    employeeSearch: "",
  };
  render() {
    return (
      <>
        {this.renderDegreeRelatedFields()}
        {this.renderTimeAndPlaceFormFields()}
        {this.renderFreeformSearch()}
        {this.renderJobiiliToggles()}
      </>
    );
  }

  private renderDegreeRelatedFields() {
    return (
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
            valueKey="name"
            icon={<UserWorker />}
            onSearch={(targetDegreeSearch) =>
              this.setState({ targetDegreeSearch })
            }
            options={AVAILABLE_DEGREE_TITLES.filter((targetDegree) =>
              this.getSearchableString(targetDegree.name).includes(
                this.getSearchableString(this.state.targetDegreeSearch)
              )
            )}
            messages={{
              multiple: this.props.request.jobTargetDegrees
                .map((degree) => degree.name)
                .join(", "),
            }}
            value={this.props.request.jobTargetDegrees}
            onChange={({ option }: { option: JobiiliDegreeTitle }) => {
              this.setState({ targetDegreeSearch: "" });
              if (this.props.request.jobTargetDegrees.includes(option))
                this.partialUpdateRequest({
                  jobTargetDegrees: this.props.request.jobTargetDegrees.filter(
                    (x) => x !== option
                  ),
                });
              else
                this.partialUpdateRequest({
                  jobTargetDegrees: [
                    ...this.props.request.jobTargetDegrees,
                    option,
                  ],
                });
            }}
          />
        </FormField>
        <FormField label="Practice classification">
          <Select
            multiple
            options={AVAILABLE_PRACTICE_CLASSIFICATIONS.filter((klass) =>
              this.getSearchableString(klass.name).includes(
                this.getSearchableString(
                  this.state.practiceClassificationSearch
                )
              )
            )}
            onSearch={(practiceClassificationSearch) =>
              this.setState({ practiceClassificationSearch })
            }
            labelKey="name"
            valueKey="name"
            icon={<Workshop />}
            messages={{
              multiple: this.props.request.jobClasses
                .map((klass) => klass.name)
                .join(", "),
            }}
            value={this.props.request.jobClasses}
            onChange={({ option }: { option: JobiiliDegreeTitle }) => {
              this.setState({ practiceClassificationSearch: "" });
              const isMetaClassification = option.misc !== null;
              const classificationsInThisOption = isMetaClassification
                ? option.misc.jobClasses.map((jobId) =>
                    AVAILABLE_PRACTICE_CLASSIFICATIONS.find(
                      (job) => job.id === jobId
                    )
                  )
                : [option];
              const newClassifications = differenceBy(
                classificationsInThisOption,
                this.props.request.jobClasses,
                (x) => x.id
              );
              this.partialUpdateRequest({
                jobClasses: [
                  ...this.props.request.jobClasses,
                  ...newClassifications,
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
            options={AVAILABLE_ORGANIZATIONS.filter((employee) =>
              this.getSearchableString(employee.name).includes(
                this.getSearchableString(this.state.employeeSearch)
              )
            )}
            onSearch={(employeeSearch) => this.setState({ employeeSearch })}
            value={this.props.request.organization || {}}
            onChange={({ option }: { option: JobiiliOrganization }) => {
              this.setState({ employeeSearch: "" });
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
      </Box>
    );
  }

  private renderTimeAndPlaceFormFields() {
    return (
      <Box gridArea="timeAndPlace">
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
        <FormField label="Miminum length of internship in weeks">
          <TextInput
            reverse
            required
            type="number"
            icon={<History />}
            value={this.props.request.minLength}
            onChange={this.getRequestPropertyChangeListener("minLength")}
          />
        </FormField>
        <Box flex direction="row">
          <FormField label="From">
            <DateInput
              inputProps={{ required: true }}
              value={this.props.request.startDate}
              format="mm/dd/yyyy"
              onChange={({ value }: any) =>
                this.partialUpdateRequest({ startDate: value })
              }
            />
          </FormField>
          <FormField label="To">
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
      </Box>
    );
  }

  private renderFreeformSearch() {
    return (
      <Box gridArea="freeform">
        <FormField label="Text search">
          <TextInput
            reverse
            icon={<SearchAdvanced />}
            value={this.props.request.combo}
            onChange={(event) =>
              this.partialUpdateRequest({ combo: event.target.value })
            }
          />
        </FormField>
        <Box flex justify="center">
          <CheckBox
            label="Text search only on employers' name"
            checked={this.props.request.comboEmployeeNameOnly}
            onChange={(event) =>
              this.partialUpdateRequest({
                comboEmployeeNameOnly: event.target.checked,
              })
            }
          />
        </Box>
      </Box>
    );
  }

  private renderJobiiliToggles() {
    return (
      <Box gridArea="jobiiliToggles">
        <Box flex direction="column">
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
