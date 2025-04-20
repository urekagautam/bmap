import InputField from "../../component/InputField";
import Button from "../../component/Button";
import OrganizationNavbar from "../../component/OrganizationNavbar";
import styles from "./OrganizationProfile.module.css";
import ImageUpload from "../../component/ImageUpload";
import { IconGreaterThan } from "../../component/icons/IconGreaterThan";
import { useState, useEffect } from "react";
import { IconCamera } from "../../component/icons/IconCamera";

export default function OrganizationProfile() {
  const [ownerPhotoFile, setOwnerPhotoFile] = useState(null);
  const [ownerPreview, setOwnerPreview] = useState(null);

  useEffect(() => {
    if (ownerPhotoFile) {
      const objectUrl = URL.createObjectURL(ownerPhotoFile);
      setOwnerPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Cleanup
    } else {
      setOwnerPreview(null);
    }
  }, [ownerPhotoFile]);

  const handleOwnerPhotChange = (e) => {
    const file = e.target.files?.[0] || null;
    setOwnerPhotoFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleVatImageChange = (file) => {
    setVatImage(file);
    console.log("VAT Image selected:", file);
  };

  return (
    <>
      <OrganizationNavbar />
      <section className={styles.mainWrapper}>
        <div className={styles.box}>
          <div className={styles.title}>
            <h1>Lets get your organization set up</h1>
            <p>
              Ensure you fill all the necessary data, It will only take u few
              minutes
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.stepOne}>
              {/* step 1/3  */}
              <span>Step 1/3</span>
              <h1 className={styles.dataTitle}>Basic Owner's Information</h1>

              <div className={styles.allDatas}>
                {/* step 1/3 : 1st section */}
                <div className={styles.NameImg}>
                  <div className={styles.InpField}>
                    <label htmlFor="ownerName">
                      Owner's Name
                      <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <InputField
                      placeholder="Enter owner's name"
                      id="ownerName"
                    />
                  </div>

                  {/* step 1/3 : 2nd section */}
                  <div className={styles.addPhoto}>
                    <div className={styles.uploadWrapper}>
                      <label
                        className={styles.uploadButton}
                        htmlFor="ownerPhoto"
                      >
                        {ownerPreview ? (
                          <div className={styles.previewContainer}>
                            <img
                              src={ownerPreview}
                              alt="Preview"
                              className={styles.previewImage}
                            />
                            <div className={styles.overlay}>
                              <span>Change</span>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.uploadText}>
                            <IconCamera />
                          </div>
                        )}
                        <input
                          type="file"
                          className={styles.file}
                          id="ownerPhoto"
                          accept="image/*"
                          hidden
                          onChange={handleOwnerPhotChange}
                        />

                        {/* LATER */}
                      </label>
                    </div>

                    <div className={styles.rightSide}>
                      <h5>Owner's Photo</h5>
                      <Button
                        className={styles.removeBtns}
                        layout="xs"
                        color="neutralLight"
                        fill="outline"
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
                      onChange={handleVatImageChange}
                      className="citizenshipFront"
                    />

                    <Button
                      className={styles.removeBtns}
                      layout="xs"
                      color="neutralLight"
                      fill="outline"
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
                      onChange={handleVatImageChange}
                      className="citizenshipBack"
                    />
                    <Button
                      className={styles.removeBtns}
                      layout="xs"
                      color="neutralLight"
                      fill="outline"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* step 2/3 */}
            <div className={styles.stepTwo}>
              <span>Step 2/3</span>
              <h1 className={styles.dataTitle}>
                Basic Organization's Information
              </h1>

              <div className={styles.orgData}>
                <div className={styles.InpField}>
                  <label className={styles.label} htmlFor="orgName">
                    Organization's Name
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField
                    placeholder="Enter organization's name"
                    id="orgName"
                  />
                </div>

                <div className={styles.InpField}>
                  <label className={styles.label} htmlFor="phoneNo">
                    Phone no
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField placeholder="Enter phone no" id="phoneNo" />
                </div>

                <div className={styles.InpField}>
                  <label className={styles.label} htmlFor="location">
                    Location
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField placeholder="Enter location" id="location" />
                </div>

                <div className={styles.InpField}>
                  <label className={styles.label} htmlFor="ownerName">
                    District
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField placeholder="Enter district" id="district" />
                </div>
              </div>
            </div>

            {/* step 3/3 */}
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
                    onChange={handleVatImageChange}
                    className="pan"
                  />

                  <Button
                    className={styles.removeBtns}
                    layout="xs"
                    color="neutralLight"
                    fill="outline"
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
                    onChange={handleVatImageChange}
                    className="vat"
                  />
                  <Button
                    className={styles.removeBtns}
                    layout="xs"
                    color="neutralLight"
                    fill="outline"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className={styles.button}>
              <Button color="accent" layout="xs">
                Next
                <IconGreaterThan />
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
