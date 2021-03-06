import * as React from "react";
import { differenceBy, difference, flatMap } from "lodash";
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
import { ReadableJobiiliRequest } from "../types";
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
import { MultiSelect } from "../../MultiSelect";
import { isMetaClassification } from "../util";

export interface Props {
  request: ReadableJobiiliRequest;
  setRequest: (request: ReadableJobiiliRequest) => any;
}

export interface State {
  employeeSearch: string;
}

const META_PRACTICE_CLASSES = AVAILABLE_PRACTICE_CLASSIFICATIONS.filter(
  (x) => x.misc !== null
);

const DATE_FORMAT = "dd/mm/yyyy";

export class JobiiliRequest extends React.PureComponent<Props, State> {
  state: State = {
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
    const jobClassesWithMetaValues = this.jobClassesWithMetaValues;
    return (
      <Box gridArea="profession">
        <FormField label="Guidance languages">
          <MultiSelect<JobiiliLanguage>
            disableSearch
            labelKey="name"
            valueKey="name"
            icon={<Language />}
            options={AVAILABLE_LANGUAGES}
            values={this.props.request.languages}
            setValues={(languages) => this.partialUpdateRequest({ languages })}
          />
        </FormField>
        <FormField
          label="Degree titles"
          name="jobTargetDegrees"
          validate={() => {
            if (this.props.request.jobTargetDegrees.length === 0)
              return {
                message: "No degree title selected",
                status: "error",
              };
          }}
        >
          <MultiSelect<JobiiliDegreeTitle>
            labelKey="name"
            valueKey="name"
            icon={<UserWorker />}
            options={AVAILABLE_DEGREE_TITLES}
            values={this.props.request.jobTargetDegrees}
            setValues={(jobTargetDegrees) =>
              this.partialUpdateRequest({ jobTargetDegrees })
            }
          />
        </FormField>
        <FormField
          label="Practice classification"
          name="jobClasses"
          validate={() => {
            if (jobClassesWithMetaValues.length === 0)
              return {
                message: "You must select at leats one pratice classification",
                status: "error",
              };
          }}
        >
          <MultiSelect<JobiiliDegreeTitle>
            labelKey="name"
            valueKey="name"
            icon={<Workshop />}
            options={AVAILABLE_PRACTICE_CLASSIFICATIONS}
            values={jobClassesWithMetaValues}
            setValues={(jobClasses) =>
              this.partialUpdateRequest({ jobClasses })
            }
            getChanges={this.getClassificationChanges}
            formatMultiple={(values) =>
              values
                .filter((klass) => !isMetaClassification(klass))
                .map((klass) => klass.name)
                .join(", ")
            }
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
          <MultiSelect<JobiiliProvince>
            labelKey="name"
            valueKey="name"
            icon={<MapLocation />}
            options={AVAILABLE_PROVINCES}
            values={this.props.request.provinces}
            setValues={(provinces) => this.partialUpdateRequest({ provinces })}
          />
        </FormField>
        <FormField label="Municipality">
          <MultiSelect<JobiiliMunicipality>
            labelKey="name"
            valueKey="name"
            icon={<Location />}
            options={AVAILABLE_MUNICIPALITIES}
            values={this.props.request.municipalities}
            setValues={(municipalities) =>
              this.partialUpdateRequest({ municipalities })
            }
          />
        </FormField>
        <FormField label="Minimum length of internship in weeks">
          <TextInput
            reverse
            type="number"
            icon={<History />}
            value={this.props.request.minLength}
            onChange={(event) =>
              this.partialUpdateRequest({
                minLength: Number(event.target.value),
              })
            }
          />
        </FormField>
        <Box flex direction="row">
          <FormField label="From">
            <DateInput
              inputProps={{ required: true }}
              value={this.props.request.startDate}
              format={DATE_FORMAT}
              onChange={({ value }: any) =>
                this.partialUpdateRequest({ startDate: value })
              }
            />
          </FormField>
          <FormField label="To">
            <DateInput
              inputProps={{ required: true }}
              value={this.props.request.endDate}
              format={DATE_FORMAT}
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

  private get jobClassesWithMetaValues() {
    const metaClassGroups = META_PRACTICE_CLASSES.map(
      ({ misc }) => misc.jobClasses
    );
    const currentClassIds = this.props.request.jobClasses.map(
      (klass) => klass.id
    );
    const idsMissingFromMetas = metaClassGroups.map((group) =>
      difference(group, currentClassIds)
    );
    const includedMetaClasses = flatMap(idsMissingFromMetas, (ids, index) => {
      if (ids.length !== 0) return [];
      else return [META_PRACTICE_CLASSES[index]];
    });
    return [...includedMetaClasses, ...this.props.request.jobClasses];
  }

  private getClassificationChanges = (option: JobiiliDegreeTitle) => {
    const classificationsInThisOption = isMetaClassification(option)
      ? option.misc.jobClasses.map((jobId) =>
          AVAILABLE_PRACTICE_CLASSIFICATIONS.find((job) => job.id === jobId)
        )
      : [option];
    const newClassifications = differenceBy(
      classificationsInThisOption,
      this.props.request.jobClasses,
      (x) => x.id
    );

    if (newClassifications.length === 0)
      return differenceBy(
        this.props.request.jobClasses,
        classificationsInThisOption,
        (x) => x.id
      );

    return [...this.props.request.jobClasses, ...newClassifications];
  };

  private partialUpdateRequest = (update: Partial<ReadableJobiiliRequest>) =>
    this.props.setRequest({ ...this.props.request, ...update });

  private getSearchableString = (search: string) => search.toLowerCase().trim();
}
