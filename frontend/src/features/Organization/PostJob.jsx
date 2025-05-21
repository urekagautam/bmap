import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      jobTitle: "",
      reqEmployees: "",
      department: "",
      jobByTime: "full_time",
      jobByLocation: "on_site",
      jobLevel: "mid_level",
      salaryDisclosure: "fixed",
      minValue: "",
      maxValue: "",
      salaryType: "monthly",
      isSalaryRequired: false,
      experienceCriteria: "",
      experience: "",
      isExperienceRequired: false,
      specialities: [],
      isSkillsRequired: false,
      jobDescription: "",
      applicationDeadline: "",
      additionalInfo: "",
    },
  });

  const salaryDisclosure = watch("salaryDisclosure");
  const specialities = watch("specialities") || [];


  //additional info ko numbering include garera
  const handleAdditionalInfo = (e) => {
    const raw = e.target.value;
    const lines = raw.split("\n");

    const numbered = lines.map(
      (line, i) => `${i + 1}. ${line.replace(/^\d+\.\s*/, "")}`
    );
    setValue("additionalInfo", numbered.join("\n"));
  };

  const additionalInfoArray = watch("additionalInfo")
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0);

  //handling submit
  const onSubmit = (data) => {
    console.log("Form data:", data);
    toast.success("Job posted successfully!");
      setTimeout(() => {
    navigate("/cmpprofile");
  }, 1000);

    reset();
  };

  return (
    <section className={styles.postjobSection}>
      <Link to="/cmpprofile" className={styles.backBtn}>
        <IconBack /> Back
      </Link>
      <div className={styles.formContainer}>
        <div className={styles.pageTitle}>
          <h1>Create New Job Posting</h1>
          <p>Fill in the details to create a new job vacancy</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.jobDetails}>
            <h2>Job Details</h2>
            <div className={styles.jd_container}>
              <div className={styles.inputRow}>
                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Job Title<span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField
                    {...register("jobTitle", {
                      required: "Job title is required",
                      minLength: {
                        value: 3,
                        message: "Job title must be at least 3 characters long",
                      },
                    })}
                    placeholder="e.g Senior Developer"
                  />
                  <span className={styles.error}>
                    {errors.jobTitle?.message}
                  </span>
                </div>

                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Req No. of Employees.
                  </label>
                  <InputField
                    type="number"
                    {...register("reqEmployees", {
                      required: "Number of employees is required",
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Please enter a valid number",
                      },
                      min: {
                        value: 1,
                        message: "Number must be at least 1",
                      },
                    })}
                    placeholder="eg. 1"
                    layout="sm"
                  />
                  <span className={styles.error}>
                    {errors.reqEmployees?.message}
                  </span>
                </div>

                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Department<span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <Controller
                    name="department"
                    control={control}
                    rules={{ required: "Department is required" }}
                    render={({ field }) => (
                      <Select
                        options={DEPARTMENT_OPTIONS}
                        placeholder="Select department"
                        onChange={(value) => {
                          field.onChange(value);
                          clearErrors("department");
                        }}
                        value={field.value || null}
                      />
                    )}
                  />
                  <span className={styles.error}>
                    {errors.department?.message}
                  </span>
                </div>
              </div>

              <div className={styles.inputRow}>
                <label className={styles.fieldLabel}>
                  Job Type <span className={styles.subLabel}>(by time)</span>
                </label>
                <Controller
                  name="jobByTime"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      options={JOB_BY_TIME}
                      name="jobByTime"
                      selectedValue={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </div>

              <div className={styles.inputRow}>
                <label className={styles.fieldLabel}>
                  <span className={styles.subLabel}>(by location)</span>
                </label>
                <Controller
                  name="jobByLocation"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      options={JOB_BY_LOCATION}
                      name="jobByLocation"
                      selectedValue={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </div>

              <div className={styles.inputRow}>
                <label className={styles.fieldLabel}>Job Level</label>
                <Controller
                  name="jobLevel"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      options={JOB_BY_LEVEL}
                      name="jobLevel"
                      selectedValue={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className={styles.salaryDetails}>
            <h2>Salary Details</h2>
            <div className={styles.sd_container}>
              <div className={styles.companySize}>
                <label className={styles.inputLabel}>Salary Offered Type</label>
                <Controller
                  name="salaryDisclosure"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      options={[
                        { value: "fixed", label: "Fixed" },
                        { value: "range", label: "Range" },
                      ]}
                      name="salaryDisclosure"
                      selectedValue={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />

                <div className={styles.minmax}>
                  <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>
                      Minimum
                      <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <InputField
                      layout="sm"
                      {...register("minValue", {
                        required: "Minimum salary is required",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Please enter a valid number",
                        },
                        validate: (value) =>
                          Number.parseInt(value) > 0 ||
                          "Salary must be greater than 0",
                      })}
                      placeholder="eg. 10000"
                    />
                    <span className={styles.error}>
                      {errors.minValue?.message}
                    </span>
                  </div>

                  <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>Maximum</label>
                    <InputField
                      layout="sm"
                      {...register("maxValue", {
                        validate: {
                          required: (value) =>
                            salaryDisclosure !== "range" ||
                            value.trim() !== "" ||
                            "Maximum salary is required",
                          greaterThanMin: (value) => {
                            if (salaryDisclosure !== "range") return true;
                            const min = watch("minValue");
                            return (
                              !min ||
                              !value ||
                              Number.parseInt(value) > Number.parseInt(min) ||
                              "Maximum must be greater than minimum"
                            );
                          },
                        },
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Please enter a valid number",
                        },
                      })}
                      placeholder="eg. 20000"
                      disabled={salaryDisclosure === "fixed"}
                      className={
                        salaryDisclosure === "fixed" ? styles.disabledInput : ""
                      }
                    />
                    <span className={styles.error}>
                      {errors.maxValue?.message}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.rightSide}>
                <div className={styles.inputRow}>
                  <label className={styles.fieldLabel}>Salary Type</label>
                  <Controller
                    name="salaryType"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        options={SALARY_TYPE}
                        name="salaryType"
                        selectedValue={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </div>

                <div className={styles.hideSalary}>
                  <label className={styles.fieldLabel}>Hide Salary</label>
                  <div className={styles.hideSwitch}>
                    <Controller
                      name="isSalaryRequired"
                      control={control}
                      render={({ field }) => (
                        <ToggleSwitch
                          isOn={field.value}
                          onToggle={(name, value) => field.onChange(value)}
                          name="isSalaryRequired"
                        />
                      )}
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
                  <Controller
                    name="experienceCriteria"
                    control={control}
                    rules={{ required: "Experience criteria is required" }}
                    render={({ field }) => (
                      <Select
                        searchable={false}
                        options={EXPERIENCE_CRITERIA_OPTIONS}
                        placeholder="Select education"
                        onChange={(value) => {
                          field.onChange(value);
                          clearErrors("experienceCriteria");
                        }}
                        value={field.value || null}
                      />
                    )}
                  />
                  <span className={styles.error}>
                    {errors.experienceCriteria?.message}
                  </span>
                </div>

                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Experience<span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <Controller
                    name="experience"
                    control={control}
                    rules={{ required: "Experience is required" }}
                    render={({ field }) => (
                      <Select
                        searchable={false}
                        layout="sm"
                        options={EXPERIENCE_OPTIONS}
                        placeholder="Select experience"
                        onChange={(value) => {
                          field.onChange(value);
                          clearErrors("experience");
                        }}
                        value={field.value || null}
                      />
                    )}
                  />
                  <span className={styles.error}>
                    {errors.experience?.message}
                  </span>
                </div>

                <div className={styles.hideSalary}>
                  <label className={styles.fieldLabel}>
                    Is experience mandatory to apply for this job ?{" "}
                  </label>
                  <div className={styles.hideSwitch}>
                    <Controller
                      name="isExperienceRequired"
                      control={control}
                      render={({ field }) => (
                        <ToggleSwitch
                          isOn={field.value}
                          onToggle={(name, value) => field.onChange(value)}
                          name="isExperienceRequired"
                        />
                      )}
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

                  <Controller
                    name="specialities"
                    control={control}
                    rules={{
                      required: "At least one speciality is required",
                      validate: {
                        minThree: (value) =>
                          value.length >= 3 ||
                          "At least 3 specialities are required",
                        maxFive: (value) =>
                          value.length <= 5 || "Maximum 5 specialities allowed",
                      },
                    }}
                    render={({ field }) => (
                      <MultiSelect
                        options={SKILL_OPTIONS}
                        placeholder="Select skills"
                        onChange={(options) => {
                          field.onChange(options);
                          clearErrors("specialities");
                        }}
                        defaultValues={field.value}
                      />
                    )}
                  />
                  <span className={styles.error}>
                    {errors.specialities?.message}
                  </span>
                </div>

                <div className={styles.selectedTags}>
                  <h2>Selected Specialities</h2>
                  <div className={styles.tagsContainer}>
                    {specialities.length > 0 ? (
                      specialities.map((option) => (
                        <span key={option.value} className={styles.tag}>
                          {option.label}
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => {
                              setValue(
                                "specialities",
                                specialities.filter(
                                  (item) => item.value !== option.value
                                )
                              );
                            }}
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
                  <Controller
                    name="isSkillsRequired"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch
                        isOn={field.value}
                        onToggle={(name, value) => field.onChange(value)}
                        name="isSkillsRequired"
                      />
                    )}
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
                  <Controller
                    name="jobDescription"
                    control={control}
                    rules={{
                      required: "Job description is required",
                      minLength: {
                        value: 50,
                        message: "Description should be at least 50 characters",
                      },
                    }}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        placeholder="Describe the roles, responsibilities and requirements."
                        rows={4}
                      />
                    )}
                  />
                  <span className={styles.error}>
                    {errors.jobDescription?.message}
                  </span>
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
                      {...register("applicationDeadline", {
                        required: "Application deadline is required",
                        validate: {
                          futureDate: (value) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const selectedDate = new Date(value);
                            return (
                              selectedDate >= today ||
                              "Date must be in the future"
                            );
                          },
                        },
                      })}
                    />
                    <span className={styles.error}>
                      {errors.applicationDeadline?.message}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.about}>
                <label className={styles.inputLabel}>
                  Additional Information
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <Controller
                  name="additionalInfo"
                  control={control}
                  rules={{
                    required: "Additional information is required",
                  }}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      onChange={(e) => {
                        handleAdditionalInfo(e);
                      }}
                      placeholder="1. Describe the benefits of your company
2. Describe the perks"
                      rows={4}
                    />
                  )}
                />
                <span className={styles.error}>
                  {errors.additionalInfo?.message}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.buttons}>
            <Button
              type="button"
              layout="sm"
              fill="outline"
              color="neutralLight"
            >
              Cancel
            </Button>
            <Button type="submit" layout="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
