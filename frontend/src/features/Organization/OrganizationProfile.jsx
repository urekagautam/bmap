import { useRef } from "react";
import styles from "./OrganizationProfile.module.css";
import { DISTRICT_OPTIONS } from "../../constants/constants.js";
import { IconGreaterThan } from "../../component/icons/IconGreaterThan";
import OrganizationNavbar from "../../component/OrganizationNavbar";
import InputField from "../../component/InputField";
import Button from "../../component/Button";
import Select from "../../component/Select";
import ImageUpload from "../../component/ImageUpload";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

export default function OrganizationProfile() {

  const selectRef = useRef(null);
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    control,
    setValue,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      ownersName: "",
      orgName: "",
      phoneNo: "",
      location: "",
      district: "",
      ownersPhoto: null,
      citizenshipFront: null,
      citizenshipBack: null,
      panCard: null,
      vatCard: null,
    },
  });

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    toast.success("Form submitted successfully!");

    // Resetting form after successfully submitting it
    reset({
      ownersName: "",
      orgName: "",
      phoneNo: "",
      location: "",
      district: "",
      ownersPhoto: null,
      citizenshipFront: null,
      citizenshipBack: null,
      panCard: null,
      vatCard: null,
    });

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
                  <label className={styles.label} htmlFor="location">
                    Location
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField
                    {...register("location", {
                      required: "Location is required",
                      minLength: {
                        value: 3,
                        message: "Location must be at least 3 characters long",
                      },
                    })}
                    placeholder="Enter location"
                    id="location"
                  />
                  <span className={styles.error}>
                    {errors.location?.message}
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
