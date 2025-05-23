import { useRef, useState, useEffect } from "react";
import styles from "./OrganizationProfile.module.css";
import { DISTRICT_OPTIONS } from "../../constants/constants.js";
import { IconGreaterThan } from "../../component/icons/IconGreaterThan";
import OrganizationNavbar from "../../component/OrganizationNavbar";
import InputField from "../../component/InputField";
import Button from "../../component/Button";
import Select from "../../component/Select";
import ImageUpload from "../../component/ImageUpload";
import { useForm, Controller } from "react-hook-form";
import useOrgAuth from "../../hooks/useOrgAuth.js";
import { apiOrganizationSetup } from "../../services/apiOrganizationAuth.js";
import { apiOrganizationGetProfile } from "../../services/apiOrganizationAuth.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function OrganizationProfile() {
  const { orgId } = useOrgAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (orgId) {
      console.log("ORGANIZATION ID : " + orgId);
    }
  }, [orgId]);

  const selectRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    getValues,
    clearErrors,
    watch,
  } = useForm({
    defaultValues: {
      ownersName: "",
      orgName: "",
      phoneNo: "",
      address: "",
      district: "",
    },
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!orgId) return;

      try {
        const profile = await apiOrganizationGetProfile(orgId);
        console.log("API Response:", profile);

        setValue("ownersName", profile.ownersName || "");
        setValue("orgName", profile.orgName || "");
        setValue("phoneNo", profile.phoneNo || "");
        setValue("address", profile.address || "");

        if (profile.district) {
          const districtOption = DISTRICT_OPTIONS.find(
            (opt) => opt.value === profile.district
          ) || {
            value: profile.district,
            label:
              profile.district.charAt(0).toUpperCase() +
              profile.district.slice(1),
          };
          setValue("district", districtOption);
        }

        console.log("Loaded profile data:", profile);
      } catch (err) {
        console.error("Error loading profile data:", err);
      }
    }

    fetchProfile();
  }, [orgId, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const districtString =
        typeof data.district === "object" ? data.district.value : data.district;
      const response = await apiOrganizationSetup({
        orgId: orgId,
        ownersName: data.ownersName,
        orgName: data.orgName,
        phoneNo: data.phoneNo,
        address: data.address,
        district: districtString,
      });

      toast.success("Profile setup complete!");
      setTimeout(() => {
        navigate("/org");
      }, 1000);
    } catch (error) {
      console.error("Setup error:", error);
      toast.error(error.message || "Setup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <OrganizationNavbar />
      <section className={styles.mainWrapper}>
        <div className={styles.box}>
          <div className={styles.title}>
            {watch("ownersName") ? (
              <h1>Update your organization setup</h1>
            ) : (
              <h1>Let's get your organization set up</h1>
            )}

            <p>
              Ensure you fill all the necessary data, It will only take u few
              minutes
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
                      {...register("ownersName", {
                        required: "Owner's name is required",
                        minLength: {
                          value: 3,
                          message: "Min 3 characters required",
                        },
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "Name should only contain letters",
                        },
                      })}
                      placeholder="Enter owner's name"
                      id="ownerName"
                    />
                    <span className={styles.error}>
                      {errors.ownersName?.message}
                    </span>
                  </div>

                  <div className={styles.addPhoto}>
                    <Controller
                      name="ownersPhoto"
                      control={control}
                      rules={{ required: "Owner's photo is required" }}
                      render={({ field }) => (
                        <ImageUpload
                          id="companyLogo"
                          shape="square"
                          imgFile={field.value}
                          multiple={false}
                          onChange={(file) => {
                            field.onChange(file);
                            clearErrors("ownersPhoto");
                          }}
                        />
                      )}
                    />
                    <div className={styles.rightSide}>
                      <h5>Owner's Photo</h5>
                      <Button
                        className={styles.removeBtns}
                        layout="xs"
                        color="neutralLight"
                        fill="outline"
                        onClick={() => {
                          setValue("ownersPhoto", null);
                        }}
                      >
                        Remove
                      </Button>
                      <span className={styles.error}>
                        {errors.ownersPhoto?.message}
                      </span>
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

                    <Controller
                      name="citizenshipFront"
                      control={control}
                      rules={{
                        required: "Citizenship front image is required",
                      }}
                      render={({ field }) => (
                        <ImageUpload
                          id="citizenshipFront"
                          ImgUploadText="Upload your Citizenship Card (Front)"
                          imgFile={field.value}
                          multiple={false}
                          onChange={(file) => {
                            field.onChange(file);
                            clearErrors("citizenshipFront");
                          }}
                        />
                      )}
                    />

                    <Button
                      className={styles.removeBtns}
                      layout="xs"
                      color="neutralLight"
                      fill="outline"
                      onClick={() => {
                        setValue("citizenshipFront", null);
                      }}
                    >
                      Remove
                    </Button>
                    <span className={styles.error}>
                      {errors.citizenshipFront?.message}
                    </span>
                  </div>
                  <div className={styles.back}>
                    <label className={styles.label}>
                      Citizenship Card
                      <span className={styles.requiredAsterisk}>*</span>
                      <span className={styles.bracketText}> (back)</span>
                    </label>
                    <Controller
                      name="citizenshipBack"
                      control={control}
                      rules={{ required: "Citizenship back image is required" }}
                      render={({ field }) => (
                        <ImageUpload
                          id="citizenshipBack"
                          ImgUploadText="Upload your Citizenship Card (Back)"
                          imgFile={field.value}
                          multiple={false}
                          onChange={(file) => {
                            field.onChange(file);
                            clearErrors("citizenshipBack");
                          }}
                        />
                      )}
                    />

                    <Button
                      className={styles.removeBtns}
                      layout="xs"
                      color="neutralLight"
                      fill="outline"
                      onClick={() => {
                        setValue("citizenshipBack", null);
                      }}
                    >
                      Remove
                    </Button>
                    <span className={styles.error}>
                      {errors.citizenshipBack?.message}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2/3 */}
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
                    {...register("orgName", {
                      required: "Organization's name is required",
                      minLength: {
                        value: 3,
                        message: "Min 3 characters required",
                      },
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message:
                          "Organization name should only contain letters",
                      },
                    })}
                    placeholder="Enter organization's name"
                    id="orgName"
                  />
                  <span className={styles.error}>
                    {errors.orgName?.message}
                  </span>
                </div>

                <div className={styles.InpField}>
                  <label className={styles.label} htmlFor="phoneNo">
                    Phone no
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField
                    {...register("phoneNo", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Phone number must be exactly 10 'digits'",
                      },
                    })}
                    placeholder="Enter phone no"
                    id="phoneNo"
                  />
                  <span className={styles.error}>
                    {errors.phoneNo?.message}
                  </span>
                </div>

                <div className={styles.InpField}>
                  <label className={styles.label} htmlFor="address">
                    Address
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField
                    {...register("address", {
                      required: "Address is required",
                      minLength: {
                        value: 3,
                        message: "Address must be at least 3 characters long",
                      },
                    })}
                    placeholder="Enter address"
                    id="address"
                  />
                  <span className={styles.error}>
                    {errors.address?.message}
                  </span>
                </div>

                <div className={styles.InpField}>
                  <label className={styles.label} htmlFor="district">
                    District
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>

                  <Controller
                    name="district"
                    control={control}
                    rules={{ required: "District is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        ref={selectRef}
                        options={DISTRICT_OPTIONS}
                        placeholder="Select district"
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value || null}
                      />
                    )}
                  />
                  <span className={styles.error}>
                    {errors.district?.message}
                  </span>
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
                  <Controller
                    name="panCard"
                    control={control}
                    rules={{ required: "PAN Card image is required" }}
                    render={({ field }) => (
                      <ImageUpload
                        id="panCard"
                        ImgUploadText="Upload your PAN Card"
                        imgFile={field.value}
                        onChange={(file) => {
                          field.onChange(file);
                          clearErrors("panCard");
                        }}
                      />
                    )}
                  />

                  <Button
                    className={styles.removeBtns}
                    layout="xs"
                    color="neutralLight"
                    fill="outline"
                    onClick={() => {
                      setValue("panCard", null);
                    }}
                  >
                    Remove
                  </Button>
                  <span className={styles.error}>
                    {errors.panCard?.message}
                  </span>
                </div>
                <div className={styles.vat}>
                  <label className={styles.label}>
                    VAT Card
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <Controller
                    name="vatCard"
                    control={control}
                    rules={{ required: "VAT Card image is required" }}
                    render={({ field }) => (
                      <ImageUpload
                        id="vatCard"
                        ImgUploadText="Upload your VAT Card"
                        imgFile={field.value}
                        onChange={(file) => {
                          field.onChange(file);
                          clearErrors("vatCard");
                        }}
                      />
                    )}
                  />

                  <Button
                    className={styles.removeBtns}
                    layout="xs"
                    color="neutralLight"
                    fill="outline"
                    onClick={() => {
                      setValue("vatCard", null);
                    }}
                  >
                    Remove
                  </Button>
                  <span className={styles.error}>
                    {errors.vatCard?.message}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.button}>
              <Button type="submit" color="accent" layout="xs">
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
