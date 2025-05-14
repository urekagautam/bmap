import { useState } from "react";
import Button from "../../component/Button";
import InputField from "../../component/InputField";
import RadioGroup from "../../component/RadioGroup";
import Select from "../../component/Select";
import { IconBack } from "../../component/icons/IconBack";
import { IconCross } from "../../component/icons/IconCross";
import { IconInvalid } from "../../component/icons/IconInvalid";
import {
  DEPARTMENT_OPTIONS,
  SKILL_OPTIONS,
  EXPERIENCE_CRITERIA_OPTIONS,
  EXPERIENCE_OPTIONS,
  JOB_BY_TIME,
  JOB_BY_LOCATION,
  JOB_BY_LEVEL,
  SALARY_TYPE,
} from "../../constants/constants.js";

import styles from "./PostJob.module.css";
import ToggleSwitch from "../../component/ToggleSwitch.jsx";
import MultiSelect from "../../component/MultiSelect.jsx";
import TextArea from "../../component/TextArea.jsx";
export default function PostJob() {
  //TOGGLE BUTTONS
  const [isExperienceRequired, setIsExperienceRequired] = useState(false);
  const handleIsExperienceRequired = (name, value) => {
    setIsExperienceRequired(value);
    console.log(`Toggled ${name} to ${value}`);
  };

  const [isSalaryRequired, setIsSalaryRequired] = useState(false);
  const handleIsSalaryRequired = (name, value) => {
    setIsSalaryRequired(value);
    console.log(`Toggled ${name} to ${value}`);
  };

  const [isSkillsRequired, setIsSkillsRequired] = useState(false);
  const handleIsSkillsRequired = (name, value) => {
    setIsSkillsRequired(value);
    console.log(`Toggled ${name} to ${value}`);
  };

  //SALARY AND DICLOSURE OPTIONS
  const sizeOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "range", label: "Range" },
  ];

  const [salaryDisclosure, setSalaryDisclosure] = useState("fixed");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const handleSalaryDisclosureChange = (value) => {
    setSalaryDisclosure(value);
    if (value === "fixed") {
      setMaxValue("");
    }
  };

  //SELECT AND MULTI SELECT OPTIONS
  const [multipleValues, setMultipleValues] = useState([]);
  const handleMultipleSelect = (options) => {
    setMultipleValues(options);
    console.log("Selected options:", options);
  };

  const [department, setDepartment] = useState("");
  const [criteria, setCriteria] = useState("");
  const [experience, setExperience] = useState("");

  //INPUT FIELDS
  const [jobTitle, setJobTitle] = useState("");
  const [reqEmployees, setReqEmployees] = useState("");

  //RADIO BOXES
  const [jobByTime, setJobByTime] = useState("full_time");
  const [jobByLocation, setJobByLocation] = useState("on_site");
  const [jobLevel, setJobLevel] = useState("mid_level");
  const [salaryType, setSalaryType] = useState("monthly");

  //TEXT AREA
  const [jobDescription, setJobDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleAdditionalInfo = (e) => {
    const raw = e.target.value;
    const lines = raw.split("\n");

    // Adding numbering
    const numbered = lines.map(
      (line, i) => `${i + 1}. ${line.replace(/^\d+\.\s*/, "")}`
    );
    setAdditionalInfo(numbered.join("\n"));
  };

  // To get the actual array without numbers:
  const additionalInfoArray = additionalInfo
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0);
    
  return (
    <section className={styles.postjobSection}>
      <span className={styles.backBtn}>
        <IconBack /> Back
      </span>
      <div className={styles.formContainer}>
        <div className={styles.pageTitle}>
          <h1>Create New Job Posting</h1>
          <p>Fill in the details to create a new job vacancy</p>
        </div>

        <form>
          <div className={styles.jobDetails}>
            <h2>Job Details</h2>
            <div className={styles.jd_container}>
              <div className={styles.inputRow}>
                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Job Title<span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g Senior Developer"
                  />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Req No. of Employees.
                  </label>
                  <InputField
                    type="number"
                    value={reqEmployees}
                    onChange={(e) => setReqEmployees(e.target.value)}
                    placeholder="eg. 1"
                    layout="sm"
                  />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Department<span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <Select
                    options={DEPARTMENT_OPTIONS}
                    placeholder="Select department"
                    onChange={setDepartment}
                    defaultValue={department}
                  />
                </div>
              </div>

              <div className={styles.inputRow}>
                <label className={styles.fieldLabel}>
                  Job Type <span className={styles.subLabel}>(by time)</span>
                </label>
                <RadioGroup
                  options={JOB_BY_TIME}
                  name="jobByTime"
                  selectedValue={jobByTime}
                  onChange={setJobByTime}
                />
              </div>

              <div className={styles.inputRow}>
                <label className={styles.fieldLabel}>
                  <span className={styles.subLabel}>(by location)</span>
                </label>
                <RadioGroup
                  options={JOB_BY_LOCATION}
                  name="jobByLocation"
                  selectedValue={jobByLocation}
                  onChange={setJobByLocation}
                />
              </div>

              <div className={styles.inputRow}>
                <label className={styles.fieldLabel}>Job Level</label>
                <RadioGroup
                  options={JOB_BY_LEVEL}
                  name="jobLevel"
                  selectedValue={jobLevel}
                  onChange={setJobLevel}
                />
              </div>
            </div>
          </div>

          <div className={styles.salaryDetails}>
            <h2>Salary Details</h2>
            <div className={styles.sd_container}>
              <div className={styles.companySize}>
                <label className={styles.inputLabel}>Salary Offered Type</label>
                <RadioGroup
                  options={sizeOptions}
                  name="salaryDisclosure"
                  selectedValue={salaryDisclosure}
                  onChange={handleSalaryDisclosureChange}
                />

                <div className={styles.minmax}>
                  <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>
                      Minimum
                      <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <InputField
                      layout="sm"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                      placeholder="eg. 10000"
                    />
                  </div>

                  <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>Maximum</label>
                    <InputField
                      layout="sm"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                      placeholder="eg. 20000"
                      disabled={salaryDisclosure === "fixed"}
                      className={
                        salaryDisclosure === "fixed" ? styles.disabledInput : ""
                      }
                    />
                  </div>
                </div>
              </div>

              <div className={styles.rightSide}>
                <div className={styles.inputRow}>
                  <label className={styles.fieldLabel}>Salary Type</label>
                  <RadioGroup
                    options={SALARY_TYPE}
                    name="salaryType"
                    selectedValue={salaryType}
                    onChange={setSalaryType}
                  />
                </div>

                <div className={styles.hideSalary}>
                  <label className={styles.fieldLabel}>Hide Salary</label>
                  <div className={styles.hideSwitch}>
                    <ToggleSwitch
                      isOn={isSalaryRequired}
                      onToggle={handleIsSalaryRequired}
                      name="isSalaryRequired"
                    />
                    <span>
                      Select this option if you prefer not to display the salary
                      to jobseekers.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.jobSpecs}>
            <h2>Job Specification</h2>
            <div className={styles.js_container}>
              <div className={styles.inputRow}>
                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Experience Criteria
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <Select
                    searchable={false}
                    options={EXPERIENCE_CRITERIA_OPTIONS}
                    placeholder="Select education"
                    onChange={setCriteria}
                    defaultValue={criteria}
                  />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Experience<span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <Select
                    searchable={false}
                    layout="sm"
                    options={EXPERIENCE_OPTIONS}
                    placeholder="Select experience"
                    onChange={setExperience}
                    defaultValue={experience}
                  />
                </div>

                <div className={styles.hideSalary}>
                  <label className={styles.fieldLabel}>
                    Is experience mandatory to apply for this job ?{" "}
                  </label>
                  <div className={styles.hideSwitch}>
                    <ToggleSwitch
                      isOn={isExperienceRequired}
                      onToggle={handleIsExperienceRequired}
                      name="isExperienceRequired"
                    />
                    <span>Turn the button on if required.</span>
                  </div>
                </div>
              </div>

              <div className={styles.specialities}>
                <div className={styles.selectfield}>
                  <label htmlFor="specialities">
                    Specialities
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>

                  <MultiSelect
                    options={SKILL_OPTIONS}
                    placeholder="Select skills"
                    onChange={handleMultipleSelect}
                    defaultValues={multipleValues}
                  />
                </div>

                <div className={styles.selectedTags}>
                  <h2>Selected Specialities</h2>
                  <div className={styles.tagsContainer}>
                    {multipleValues.length > 0 ? (
                      multipleValues.map((option) => (
                        <span key={option.value} className={styles.tag}>
                          {option.label}
                          <button
                            className={styles.removeBtn}
                            onClick={() =>
                              setMultipleValues((prev) =>
                                prev.filter(
                                  (item) => item.value !== option.value
                                )
                              )
                            }
                          >
                            <IconCross />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span>No options selected</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.isSkillRequired}>
                <div className={styles.mandatory}>
                  <IconInvalid />
                  <span>
                    Enter up to 5 primary skills required for this position
                  </span>
                </div>

                <div className={styles.mark}>
                  <ToggleSwitch
                    isOn={isSkillsRequired}
                    onToggle={handleIsSkillsRequired}
                    name="isSkillsRequired"
                  />
                  <span>Mark this skill as required.</span>
                </div>
              </div>

              <div className={styles.descXdocs}>
                <div className={styles.about}>
                  <label className={styles.inputLabel}>
                    Job Description
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <TextArea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Describe the roles, responsibilities and requirements."
                    rows={4}
                  />
                </div>

                <div className={styles.docXdeadline}>
                  <div className={styles.resume}>
                    <label className={styles.resume}>Required Document</label>
                    <div className={styles.checkbox}>
                      <input type="checkbox" checked readOnly />
                      <span className={styles.resumeText}>Resume / cv</span>
                    </div>
                  </div>

                  <div className={styles.docs}>
                    <label className={styles.fieldLabel}>
                      Application Deadline
                      <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <InputField
                      type="date"
                      layout="sm"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g Senior Developer"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.about}>
                <label className={styles.inputLabel}>
                  Additional Information
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <TextArea
                  value={additionalInfo}
                  onChange={(e) => handleAdditionalInfo(e)}
                  placeholder="1. Describe the benefits of your company
2. Describe the perks"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className={styles.buttons}>
            <Button layout="sm" fill="outline" color="neutralLight">
              Cancel
            </Button>
            <Button layout="sm">Save Changes</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
