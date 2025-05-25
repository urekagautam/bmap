import { useState } from "react";
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
  // 🟢 Basic Details
  const [orgName, setOrgName] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [foundedYear, setFoundedYear] = useState("");

  const [firstName, setFirstName] = useState("");
  const [multipleValues, setMultipleValues] = useState([]);
  const [sizeType, setSizeType] = useState("fixed");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [about, setAbout] = useState("");
  const [benefits, setBenefits] = useState("");

  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");

  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyCover, setCompanyCover] = useState(null);

  const handleMultipleSelect = (options) => {
    setMultipleValues(options);
  };

  const handleSizeTypeChange = (value) => {
    setSizeType(value);
    if (value === "fixed") setMaxValue("");
  };

  const sizeOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "range", label: "Range" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      orgName,
      district,
      address,
      phone,
      email,
      foundedYear,
      firstName,
      skills: multipleValues,
      sizeType,
      minValue,
      maxValue,
      about,
      benefits,
      instagram,
      facebook,
      twitter,
      companyLogo,
      companyCover,
    };
    console.log("🚀 Submitted Data:", payload);
  };

  return (
    <section className={styles.editTabSection}>
      <div className={styles.pageTitle}>
        <h1>Edit Information</h1>
        <p>Update your company's profile information</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Details */}
        <div className={styles.basicDetails}>
          <h2>Basic Details</h2>
          <div className={styles.bd_container}>
            <div className={styles.inputfield}>
              <label>Organization's Name<span className={styles.requiredAsterisk}>*</span></label>
              <InputField placeholder="Enter Organization's Name" layout="md" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className={styles.inputfield}>
              <label>District<span className={styles.requiredAsterisk}>*</span></label>
              <InputField placeholder="Enter District" layout="md" value={district} onChange={(e) => setDistrict(e.target.value)} />
            </div>
            <div className={styles.inputfield}>
              <label>Address<span className={styles.requiredAsterisk}>*</span></label>
              <InputField placeholder="Enter Address" layout="md" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className={styles.inputfield}>
              <label>Phone No.<span className={styles.requiredAsterisk}>*</span></label>
              <InputField placeholder="Enter Phone no" layout="md" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className={styles.inputfield}>
              <label>E-mail<span className={styles.requiredAsterisk}>*</span></label>
              <InputField placeholder="Enter Organization's Email" layout="md" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.inputfield}>
              <label>Founded Year<span className={styles.requiredAsterisk}>*</span></label>
              <InputField placeholder="Enter Founded Year" layout="md" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className={styles.companyInfo}>
          <h2>Company Information</h2>
          <div className={styles.ci_container}>
            <div className={styles.top}>
              <div className={styles.inputfield}>
                <label>Owners Name<span className={styles.requiredAsterisk}>*</span></label>
                <InputField placeholder="Enter Organization's Owners Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>

              <div className={styles.selectfield}>
                <label>Specialities<span className={styles.requiredAsterisk}>*</span></label>
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
                    <label>Minimum<span className={styles.requiredAsterisk}>*</span></label>
                    <InputField
                      layout="sm"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                      placeholder="eg. 10000"
                    />
                  </div>

                  <div className={styles.inputWrapper}>
                    <label>Maximum</label>
                    <InputField
                      layout="sm"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                      placeholder="eg. 20000"
                      disabled={sizeType === "fixed"}
                      className={sizeType === "fixed" ? styles.disabledInput : ""}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.about}>
                <label>About<span className={styles.requiredAsterisk}>*</span></label>
                <TextArea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Describe about your company"
                  rows={4}
                />
              </div>
            </div>

            <div className={styles.bottom}>
              <label>Benefits<span className={styles.requiredAsterisk}>*</span></label>
              <TextArea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="eg. Competitive Salary and equity package"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Social Profile */}
        <div className={styles.socialProfile}>
          <h2>Social Profile</h2>
          <div className={styles.sp_container}>
            <div className={styles.social}>
              <IconInstagram />
              <InputField placeholder="eg. username" layout="fw" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
            </div>

            <div className={styles.social}>
              <IconFacebook />
              <InputField placeholder="eg. username" layout="fw" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
            </div>
            <div className={styles.social}>
              <IconX />
              <InputField placeholder="eg. username" layout="fw" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Brand Assets */}
        <div className={styles.brandAssets}>
          <h2>Brand Assets</h2>
          <div className={styles.ba_container}>
            <div className={styles.addPhoto}>
              <div className={styles.logoContainer}>
                <ImageUpload
                  id="companyLogo"
                  shape="circle"
                  imgFile={companyLogo}
                  onChange={(file) => setCompanyLogo(file)}
                />
                <div className={styles.rightSide}>
                  <label>Company Logo</label>
                  <Button type="button" layout="xs" color="neutralLight" fill="outline" onClick={() => setCompanyLogo(null)}>
                    Remove
                  </Button>
                </div>
              </div>
              <span>Recommended: Square image, at least 300x300 pixels, JPG or PNG format</span>
            </div>

            <div className={styles.coverContainer}>
              <label>Cover Photo</label>
              <ImageUpload
                id="companyCover"
                imgFile={companyCover}
                ImgUploadText="Upload Cover Photo"
                onChange={(file) => setCompanyCover(file)}
              />
              <Button className={styles.removeBtns} type="button" layout="xs" color="neutralLight" fill="outline" onClick={() => setCompanyCover(null)}>
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className={styles.buttons}>
          <Button layout="sm" fill="outline" color="neutralLight" type="button">
            Cancel
          </Button>
          <Button layout="sm" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </section>
  );
}
