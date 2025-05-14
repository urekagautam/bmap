import { useState } from "react";
import styles from "./OrganizationProfile.module.css";
import { DISTRICT_OPTIONS } from "../../constants/constants.js";
import { IconGreaterThan } from "../../component/icons/IconGreaterThan";
import OrganizationNavbar from "../../component/OrganizationNavbar";
import InputField from "../../component/InputField";
import Button from "../../component/Button";
import Select from "../../component/Select";
import ImageUpload from "../../component/ImageUpload";

export default function OrganizationProfile() {
  // IMAGES HANDLING
  const [ownersPhoto, setOwnersPhoto] = useState(null);
  const [citizenshipFront, setCitizenshipFront] = useState(null);
  const [citizenshipBack, setCitizenshipBack] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [vatCard, setVatCard] = useState(null);

  // INPUT FIELDS
  const [ownerName, setOwnerName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Owner's Name:", ownerName);
    console.log("Organization's Name:", orgName);
    console.log("Phone No:", phoneNo);
    console.log("Location:", location);
    console.log("District:", selectedDistrict);
    console.log("Owner's Photo:", ownersPhoto?.name);
    console.log("Citizenship Front:", citizenshipFront?.name);
    console.log("Citizenship Back:", citizenshipBack?.name);
    console.log("PAN Card:", panCard?.name);
    console.log("VAT Card:", vatCard?.name);
  };

  return (
    <>
      <OrganizationNavbar />
      <section className={styles.mainWrapper}>
        <div className={styles.box}>
          <div className={styles.title}>
            <h1>Lets get your organization set up</h1>
            <p>Ensure you fill all the necessary data, It will only take u few minutes</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.stepOne}>
              {/* Step 1/3 */}
              <span>Step 1/3</span>
              <h1 className={styles.dataTitle}>Basic Owner's Information</h1>

              <div className={styles.allDatas}>
                <div className={styles.NameImg}>
                  <div className={styles.InpField}>
                    <label htmlFor="ownerName">
                      Owner's Name
                      <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <InputField
                      placeholder="Enter owner's name"
                      id="ownerName"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  </div>

                  <div className={styles.addPhoto}>
                    <ImageUpload
                      id="companyLogo"
                      shape="square"
                      imgFile={ownersPhoto}
                      onChange={(file) => {
                        setOwnersPhoto(file);
                      }}
                    />

                    <div className={styles.rightSide}>
                      <h5>Owner's Photo</h5>
                      <Button
                        className={styles.removeBtns}
                        layout="xs"
                        color="neutralLight"
                        fill="outline"
                        onClick={() => setOwnersPhoto(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className={styles.citizenship}>
                  <div className={styles.front}>
                    <label className={styles.label}>
                      Citizenship Card
                      <span className={styles.requiredAsterisk}>*</span>
                      <span className={styles.bracketText}> (front)</span>
                    </label>
                    <ImageUpload
                      id="citizenshipFront"
                      ImgUploadText="Upload your Citizenship Card"
                      imgFile={citizenshipFront}
                      onChange={(file) => setCitizenshipFront(file)}
                      className="citizenshipFront"
                    />

                    <Button
                      className={styles.removeBtns}
                      layout="xs"
                      color="neutralLight"
                      fill="outline"
                      onClick={() => setCitizenshipFront(null)}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className={styles.back}>
                    <label className={styles.label}>
                      Citizenship Card
                      <span className={styles.requiredAsterisk}>*</span>
                      <span className={styles.bracketText}> (back)</span>
                    </label>
                    <ImageUpload
                      id="citizenshipBack"
                      ImgUploadText="Upload your Citizenship Card"
                      imgFile={citizenshipBack}
                      onChange={(file) => setCitizenshipBack(file)}
                      className="citizenshipBack"
                    />
                    <Button
                      className={styles.removeBtns}
                      layout="xs"
                      color="neutralLight"
                      fill="outline"
                      onClick={() => setCitizenshipBack(null)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2/3 */}
            <div className={styles.stepTwo}>
              <span>Step 2/3</span>
              <h1 className={styles.dataTitle}>Basic Organization's Information</h1>

              <div className={styles.orgData}>
                <div className={styles.InpField}>
                  <label className={styles.label} htmlFor="orgName">
                    Organization's Name
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField
                    placeholder="Enter organization's name"
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>

                <div className={styles.InpField}>
                  <label className={styles.label} htmlFor="phoneNo">
                    Phone no
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField
                    placeholder="Enter phone no"
                    id="phoneNo"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                  />
                </div>

                <div className={styles.InpField}>
                  <label className={styles.label} htmlFor="location">
                    Location
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField
                    placeholder="Enter location"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className={styles.InpField}>
                  <label className={styles.label} htmlFor="ownerName">
                    District
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <Select
                    options={DISTRICT_OPTIONS}
                    placeholder="Select district"
                    onChange={setSelectedDistrict}
                    defaultValues={selectedDistrict}
                  />
                </div>
              </div>
            </div>

            {/* Step 3/3 */}
            <div className={styles.stepThree}>
              <span>Step 3/3</span>
              <h1 className={styles.dataTitle}>Registration Information</h1>

              <div className={styles.registration}>
                <div className={styles.pan}>
                  <label className={styles.label}>
                    PAN Card
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <ImageUpload
                    id="pan"
                    ImgUploadText="Upload your PAN Card"
                    imgFile={panCard}
                    onChange={(file) => setPanCard(file)}
                    className="pan"
                  />

                  <Button
                    className={styles.removeBtns}
                    layout="xs"
                    color="neutralLight"
                    fill="outline"
                    onClick={() => setPanCard(null)}
                  >
                    Remove
                  </Button>
                </div>
                <div className={styles.vat}>
                  <label className={styles.label}>
                    VAT Card
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <ImageUpload
                    id="vat"
                    ImgUploadText="Upload your VAT Card"
                    imgFile={vatCard}
                    onChange={(file) => setVatCard(file)}
                    className="vat"
                  />
                  <Button
                    className={styles.removeBtns}
                    layout="xs"
                    color="neutralLight"
                    fill="outline"
                    onClick={() => setVatCard(null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className={styles.button}>
              <Button color="accent" layout="xs">
                Submit
                <IconGreaterThan />
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
