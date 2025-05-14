import { useState, useEffect } from "react";
import styles from "./EditTab.module.css";
import Button from "../../../component/Button.jsx";
import InputField from "../../../component/InputField.jsx";
import RadioGroup from "../../../component/RadioGroup.jsx";
import TextArea from "../../../component/TextArea.jsx";
import MultiSelect from "../../../component/MultiSelect.jsx";
import { SKILL_OPTIONS } from "../../../constants/constants.js";
import { IconCross } from "../../../component/icons/IconCross.jsx";
import { IconInstagram } from "../../../component/icons/IconInstagram.jsx";
import { IconFacebook } from "../../../component/icons/IconFacebook.jsx";
import { IconX } from "../../../component/icons/IconX.jsx";
import ImageUpload from "../../../component/ImageUpload.jsx";

export default function EditTab() {
  const [multipleValues, setMultipleValues] = useState([]);

  const handleMultipleSelect = (options) => {
    setMultipleValues(options);
    console.log("Selected options:", options);
  };

  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyCover, setCompanyCover] = useState(null);

  console.log("🧾 Company Logo:", companyLogo?.name);
  console.log("🧾 Company Cover:", companyCover?.name);

  const [sizeType, setSizeType] = useState("fixed");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [about, setAbout] = useState("");
  const [benefits, setBenefits] = useState("");

  const handleSizeTypeChange = (value) => {
    setSizeType(value);
    if (value === "fixed") {
      setMaxValue("");
    }
  };

  const sizeOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "range", label: "Range" },
  ];

  return (
    <section className={styles.editTabSection}>
      <div className={styles.pageTitle}>
        <h1>Edit Information</h1>
        <p>Update your company's profile information</p>
      </div>

      <form>
        <div className={styles.basicDetails}>
          <h2>Basic Details</h2>
          <div className={styles.bd_container}>
            <div className={styles.inputfield}>
              <label htmlFor="firstName">
                First Name<span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField layout="md" />
            </div>
            <div className={styles.inputfield}>
              <label htmlFor="firstName">
                First Name<span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField layout="md" />
            </div>
            <div className={styles.inputfield}>
              <label htmlFor="firstName">
                First Name<span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField layout="md" />
            </div>
            <div className={styles.inputfield}>
              <label htmlFor="firstName">
                First Name<span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField layout="md" />
            </div>
            <div className={styles.inputfield}>
              <label htmlFor="firstName">
                First Name<span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField layout="md" />
            </div>
            <div className={styles.inputfield}>
              <label htmlFor="firstName">
                First Name<span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField layout="md" />
            </div>
          </div>
        </div>
        <div className={styles.companyInfo}>
          <h2>Company Information</h2>
          <div className={styles.ci_container}>
            <div className={styles.top}>
              <div className={styles.inputfield}>
                <label htmlFor="firstName">
                  First Name<span className={styles.requiredAsterisk}>*</span>
                </label>
                <InputField />
              </div>

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
                              prev.filter((item) => item.value !== option.value)
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
            <div className={styles.middle}>
              <div className={styles.companySize}>
                <label className={styles.inputLabel}>Company Size</label>
                <RadioGroup
                  options={sizeOptions}
                  name="sizeType"
                  selectedValue={sizeType}
                  onChange={handleSizeTypeChange}
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
                      disabled={sizeType === "fixed"}
                      className={
                        sizeType === "fixed" ? styles.disabledInput : ""
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={styles.about}>
                <label className={styles.inputLabel}>
                  About<span className={styles.requiredAsterisk}>*</span>
                </label>
                <TextArea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Describe about your company"
                  rows={4}
                />
              </div>
            </div>

            <div className={styles.bottom}>
              <label className={styles.inputLabel}>
                Benefits<span className={styles.requiredAsterisk}>*</span>
              </label>
              <TextArea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="eg. Competitive Salary and equity package"
                rows={4}
              />
            </div>
          </div>
        </div>
        <div className={styles.socialProfile}>
          <h2>Social Profile</h2>

          <div className={styles.sp_container}>
            <div className={styles.social}>
              <IconInstagram />
              <InputField placeholder="eg. username" layout="fw" />
            </div>

            <div className={styles.social}>
              <IconFacebook />
              <InputField placeholder="eg. username" layout="fw" />
            </div>
            <div className={styles.social}>
              <IconX />
              <InputField placeholder="eg. username" layout="fw" />
            </div>
          </div>
        </div>
        <div className={styles.brandAssets}>
          <h2>Brand Assets</h2>

          <div className={styles.ba_container}>
            <div className={styles.addPhoto}>
              <div className={styles.logoContainer}>
                <ImageUpload
                  id="companyLogo"
                  shape="circle"
                  imgFile={companyLogo}
                  onChange={(file) => {
                    setCompanyLogo(file);
                    console.log("Selected File:", file);
                  }}
                />

                <div className={styles.rightSide}>
                  <label className={styles.inputLabel}>Company Logo</label>
                  <Button
                    type="button"
                    /*  className={styles.removeBtns} */
                    layout="xs"
                    color="neutralLight"
                    fill="outline"
                    onClick={() => setCompanyLogo(null)}
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

            <div className={styles.coverContainer}>
              <label className={styles.inputLabel}>Cover Photo</label>
              <ImageUpload
                id="companyCover"
                imgFile={companyCover}
                ImgUploadText="Upload Cover Photo"
                onChange={(file) => {
                  setCompanyCover(file);
                  console.log("Selected File:", file);
                }}
              />
              <Button
                type="button"
                className={styles.removeBtns}
                layout="xs"
                color="neutralLight"
                fill="outline"
                onClick={() => setCompanyCover(null)}
              >
                Remove
              </Button>
            </div>

            {/*  <ImageUpload ImgUploadText="Upload your vat card" /> */}
          </div>
        </div>
        <div className={styles.buttons}>
          <Button layout="sm" fill="outline" color="neutralLight">
            Cancel
          </Button>
          <Button layout="sm">Save Changes</Button>
        </div>
      </form>
    </section>
  );
}