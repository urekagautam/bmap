import Button from "../../../component/Button.jsx";
import ImageUpload from "../../../component/ImageUpload.jsx";
import styles from "./EditInformation.module.css";
import { useState } from "react";
import InputField from "../../../component/InputField";
import Select from "../../../component/Select";
import { IconLinkedIn } from "../../../component/icons/IconLinkedIn.jsx";
import { IconX } from "../../../component/icons/IconX.jsx";
import { IconWeb } from "../../../component/icons/IconWeb.jsx";
import { IconFacebook } from "../../../component/icons/IconFacebook.jsx";
import { IconInstagram } from "../../../component/icons/IconInstagram.jsx";
import { IconGithub } from "../../../component/icons/IconGithub.jsx";
import {
  DISTRICT_OPTIONS,
  FIELD_OF_EXPERTISE_OPTIONS,
  GENDER_OPTIONS,
  JOB_BY_LEVEL,
  JOB_BY_LOCATION,
  JOB_BY_TIME,
  JOB_BY_TITLE,
  SKILL_OPTIONS,
} from "../../../constants/constants";
import RadioGroup from "../../../component/RadioGroup";
import MultiSelect from "../../../component/MultiSelect";
import { IconCross } from "../../../component/icons/IconCross";
import TextArea from "../../../component/TextArea";

export default function EditInformation() {
  const [companyLogo, setCompanyLogo] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const sizeOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "range", label: "Range" },
  ];

  const handleRemoveImage = () => {
    setCompanyLogo(null);
  };

  const handleSkillChange = (skills) => {
    console.log("Skills selected:", skills);
    setSelectedSkills(skills);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = selectedSkills.filter(
      (skill) => skill.value !== skillToRemove.value
    );
    setSelectedSkills(updatedSkills);
    console.log("Skill removed, remaining:", updatedSkills); 
  };

  return (
    <section className={styles.editContainer}>
      <div className={styles.pageTitle}>
        <h1>Edit User Information</h1>
        <p>Update user's profile information</p>
      </div>

      <div className={styles.basicDetails}>
        <h2>Basic Details</h2>
        <div className={styles.bd_container}>
          <div className={styles.addPhoto}>
            <div className={styles.logoContainer}>
              <ImageUpload
                id="companyLogo"
                shape="circle"
                imgFile={companyLogo}
                onChange={(file) => setCompanyLogo(file)}
              />
              <div className={styles.rightSide}>
                <label>User Profile Photo</label>
                <Button
                  type="button"
                  layout="xs"
                  color="neutralLight"
                  fill="outline"
                  onClick={handleRemoveImage}
                >
                  Remove
                </Button>
              </div>
            </div>
            <span>
              Recommended: Square image, at least 300x300 pixels, JPG or PNG
              format
            </span>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.smallInputs}>
              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>
                  First Name
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <InputField layout="sm" placeholder="Enter First Name" />
              </div>
              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>
                  Last Name
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <InputField layout="sm" placeholder="Enter Last Name" />
              </div>
            </div>

            <div className={styles.inputField}>
              <label className={styles.fieldLabel}>
                Address
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField placeholder="Enter Address" />
            </div>
            <div className={styles.inputField}>
              <label className={styles.fieldLabel}>
                District
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <Select
                options={DISTRICT_OPTIONS}
                placeholder="Select district"
              />
            </div>
          </div>

          <div className={styles.inputRow2}>
            <div className={styles.inputField}>
              <label className={styles.fieldLabel}>
                Phone Number
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField placeholder="Enter Phone Number" />
            </div>

            <div className={styles.inputField}>
              <label className={styles.fieldLabel}>
                E-mail
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField placeholder="Enter E-mail" />
            </div>

            <div className={styles.inputField}>
              <label className={styles.fieldLabel}>
                Gender
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <RadioGroup
                name="gender"
                options={GENDER_OPTIONS}
                selectedValue="M"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.userDetails}>
        <h2>User Information</h2>
        <div className={styles.ui_container}>
          <div className={styles.top}>
            <div className={styles.inputField}>
              <label className={styles.fieldLabel}>
                Field of Interest
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <Select
                options={FIELD_OF_EXPERTISE_OPTIONS}
                placeholder="Select preferred category"
              />
            </div>

            <div className={styles.selectfield}>
              <label className={styles.fieldLabel}>
                Skills
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <MultiSelect
                options={SKILL_OPTIONS}
                placeholder="Select skills"
                onChange={handleSkillChange}
                defaultValues={selectedSkills}
              />
            </div>

            <div className={styles.selectedTags}>
              <h2>Selected Skills</h2>
              <div className={styles.tagsContainer}>
                {selectedSkills.length > 0 ? (
                  selectedSkills.map((skill) => (
                    <span key={skill.value} className={styles.tag}>
                      {skill.label}
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <IconCross />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className={styles.noSkillsText}>
                    No skills selected yet
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.about}>
            <label className={styles.fieldLabel}>
              About<span className={styles.requiredAsterisk}>*</span>
            </label>
            <TextArea placeholder="Describe about your yourself" rows={4} />
          </div>
        </div>
      </div>

      <div className={styles.jobDetails}>
        <h2>Job Details</h2>
        <div className={styles.jd_container}>
          <div className={styles.top}>
            <div className={styles.inputField}>
              <label className={styles.fieldLabel}>
                Preffered Job Title
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <Select options={JOB_BY_TITLE} placeholder="Select job title" />
            </div>

            <div className={styles.jobbyDetails}>
              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>
                  Job Type <span className={styles.subTitle}>(by time)</span>
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <RadioGroup
                  name="jobbytime"
                  options={JOB_BY_TIME}
                  selectedValue="fulltime"
                />
              </div>

              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>
                  <span className={styles.subTitle}>(by location)</span>
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <RadioGroup
                  name="jobbylocation"
                  options={JOB_BY_LOCATION}
                  selectedValue="on_site"
                />
              </div>
            </div>
          </div>

          <div className={styles.inputField}>
            <label className={styles.fieldLabel}>
              Job Level
              <span className={styles.requiredAsterisk}>*</span>
            </label>
            <RadioGroup
              name="jobbylevel"
              options={JOB_BY_LEVEL}
              selectedValue="intern"
            />
          </div>
        </div>
      </div>

      <div className={styles.socialDetails}>
        <h2>Social Profile</h2>
        <div className={styles.so_container}>
          <div className={styles.socialRow}>
            <div className={styles.social}>
              <IconInstagram />
              <InputField placeholder="eg. username" />
            </div>
            <div className={styles.social}>
              <IconFacebook />
              <InputField placeholder="eg. username" />
            </div>
            <div className={styles.social}>
              <IconX />
              <InputField placeholder="eg. username" />
            </div>
          </div>

          <div className={styles.socialRow}>
            <div className={styles.social}>
              <IconLinkedIn />
              <InputField placeholder="eg. username" />
            </div>
            <div className={styles.social}>
              <IconGithub />
              <InputField placeholder="eg. username" />
            </div>
            <div className={styles.social}>
              <IconWeb />
              <InputField placeholder="e.g  https://yourportfolio.com" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <Button type="button" layout="sm" fill="outline" color="neutralLight">
          Cancel
        </Button>
        <Button type="submit" layout="sm">
          Save Changes
        </Button>
      </div>
    </section>
  );
}
