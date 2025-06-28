import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from "./EditTab.module.css";
import Button from "../../../component/Button.jsx";
import InputField from "../../../component/InputField.jsx";
import Select from "../../../component/Select.jsx";
import RadioGroup from "../../../component/RadioGroup.jsx";
import TextArea from "../../../component/TextArea.jsx";
import MultiSelect from "../../../component/MultiSelect.jsx";
import {
  SKILL_OPTIONS,
  DISTRICT_OPTIONS,
  INDUSTRY_OPTIONS, 
} from "../../../constants/constants.js";
import { IconCross } from "../../../component/icons/IconCross.jsx";
import { IconInstagram } from "../../../component/icons/IconInstagram.jsx";
import { IconFacebook } from "../../../component/icons/IconFacebook.jsx";
import { IconX } from "../../../component/icons/IconX.jsx";
import ImageUpload from "../../../component/ImageUpload.jsx";
import {
  apiGetOrganizationProfileForEdit,
  apiEditOrganizationInfo,
} from "../../../services/apiOrganizationAuth.js";
import useOrgAuth from "../../../hooks/useOrgAuth.js";
import toast from "react-hot-toast";

export default function EditTab({ orgData, onCancel, onUpdateSuccess }) {
  const { orgId } = useOrgAuth();
  const selectRef = useRef(null);
  const industrySelectRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    clearErrors,
  } = useForm({
    defaultValues: {
      orgName: "",
      district: "",
      address: "",
      phoneNo: "",
      email: "",
      foundedYear: "",
      industry: "", 
      specialities: [],
      companySize: "fixed",
      minEmployees: "",
      maxEmployees: "",
      description: "",
      benefits: "",
      socialProfile: {
        instagram: "",
        facebook: "",
        twitter: "",
      },
      companyLogo: null,
      companyCover: null,
    },
  });

  const watchedCompanySize = watch("companySize");
  const watchedSpecialities = watch("specialities");
  const watchedIndustry = watch("industry"); 

  const getIndustryLabel = (industryValue) => {
    if (!industryValue) return "Not specified";
    
    if (typeof industryValue === "object" && industryValue.label) {
      return industryValue.label;
    }
    
    const industryOption = INDUSTRY_OPTIONS.find(opt => opt.value === industryValue);
    return industryOption ? industryOption.label : industryValue;
  };

  const convertBenefitsToArray = (benefitsString) => {
    if (!benefitsString || typeof benefitsString !== "string") return [];

    return benefitsString
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const convertSpecialitiesToStringArray = (specialitiesArray) => {
    if (!Array.isArray(specialitiesArray)) return [];

    return specialitiesArray
      .map((item) => {
        if (typeof item === "object" && item.value) {
          return item.value;
        }
        return String(item);
      })
      .filter(Boolean);
  };

  useEffect(() => {
    async function fetchProfileForEdit() {
      if (!orgId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Fetching profile data for orgId:", orgId);
        const profile = await apiGetOrganizationProfileForEdit(orgId);
        console.log("Fetched profile data:", profile);

        setProfileData(profile);

        if (profile.orgName) setValue("orgName", profile.orgName);
        if (profile.address) setValue("address", profile.address);
        if (profile.phoneNo) setValue("phoneNo", profile.phoneNo);
        if (profile.email) setValue("email", profile.email);
        if (profile.foundedYear)
          setValue("foundedYear", profile.foundedYear.toString());
        if (profile.description) setValue("description", profile.description);
        if (profile.minEmployees)
          setValue("minEmployees", profile.minEmployees.toString());
        if (profile.maxEmployees)
          setValue("maxEmployees", profile.maxEmployees.toString());

        if (profile.industry) {
          console.log("Setting industry from profile:", profile.industry);
          const industryOption = INDUSTRY_OPTIONS.find(
            (opt) => opt.value === profile.industry
          );
          
          if (industryOption) {
            setValue("industry", industryOption); 
            console.log("Industry option found and set:", industryOption);
          } else {
           
            const customIndustryOption = {
              value: profile.industry,
              label: profile.industry.charAt(0).toUpperCase() + profile.industry.slice(1),
            };
            setValue("industry", customIndustryOption);
            console.log("Custom industry option created:", customIndustryOption);
          }
        }

        if (profile.benefits) {
          if (Array.isArray(profile.benefits)) {
            const benefitsString = profile.benefits.join("\n");
            setValue("benefits", benefitsString);
            console.log(
              " Benefits loaded as array and converted to string:",
              benefitsString
            );
          } else if (typeof profile.benefits === "string") {
            setValue("benefits", profile.benefits);
            console.log(" Benefits loaded as string:", profile.benefits);
          }
        }

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

        if (profile.specialities) {
          let specialitiesArray = [];
          if (Array.isArray(profile.specialities)) {
            specialitiesArray = profile.specialities.map((skill) => {
              if (typeof skill === "string") {
                const foundOption = SKILL_OPTIONS.find(
                  (opt) => opt.value === skill || opt.label === skill
                );
                return foundOption || { value: skill, label: skill };
              }
              return skill;
            });
          }
          setValue("specialities", specialitiesArray);
          console.log(" Specialities loaded:", specialitiesArray);
        }

        // Handling company size
        if (profile.maxEmployees && profile.minEmployees) {
          setValue("companySize", "range");
        } else {
          setValue("companySize", "fixed");
        }

        if (profile.socialProfile) {
          if (profile.socialProfile.insta)
            setValue("socialProfile.instagram", profile.socialProfile.insta);
          if (profile.socialProfile.fb)
            setValue("socialProfile.facebook", profile.socialProfile.fb);
          if (profile.socialProfile.x)
            setValue("socialProfile.twitter", profile.socialProfile.x);
        }

        console.log("Profile data loaded successfully");
      } catch (err) {
        console.error("Error loading profile data:", err);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileForEdit();
  }, [orgId, setValue]);

  const handleMultipleSelect = (options) => {
    setValue("specialities", options);
  };

  const handleSizeTypeChange = (value) => {
    setValue("companySize", value);
    if (value === "fixed") {
      setValue("maxEmployees", "");
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (onCancel) {
      onCancel(); // This will switch back to about tab
    }
  };

  const sizeOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "range", label: "Range" },
  ];

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const districtString =
        typeof data.district === "object" ? data.district.value : data.district;
      const industryString =
        typeof data.industry === "object" ? data.industry.value : data.industry;

      const specialitiesStringArray = convertSpecialitiesToStringArray(
        data.specialities
      );

      const benefitsStringArray = convertBenefitsToArray(data.benefits);

      const payload = {
        orgName: data.orgName || "",
        district: districtString || "",
        address: data.address || "",
        phoneNo: data.phoneNo || "",
        email: data.email || "",
        foundedYear: data.foundedYear
          ? Number.parseInt(data.foundedYear, 10)
          : null,
        industry: industryString || "", // This will now be the value, not the object
        specialities: specialitiesStringArray,
        companySize: data.companySize || "fixed",
        minEmployees: data.minEmployees
          ? Number.parseInt(data.minEmployees, 10)
          : null,
        maxEmployees: data.maxEmployees
          ? Number.parseInt(data.maxEmployees, 10)
          : null,
        description: data.description || "",
        benefits: benefitsStringArray,
        socialProfile: {
          insta: data.socialProfile?.instagram || "",
          fb: data.socialProfile?.facebook || "",
          x: data.socialProfile?.twitter || "",
        },
        companyLogo: data.companyLogo,
        companyCover: data.companyCover,
      };

      console.log("Final Payload (correctly formatted):", payload);
      console.log("Industry being sent:", payload.industry);
      console.log("Benefits (array of strings):", benefitsStringArray);
      console.log("Specialities (array of strings):", specialitiesStringArray);

      await apiEditOrganizationInfo(orgId, payload);

      // Call success handler
      if (onUpdateSuccess) {
        onUpdateSuccess(); // This will show toast, switch to about tab, and reload page
      } else {
        // Fallback if no handler provided
        toast.success("Profile updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      const updatedProfile = await apiGetOrganizationProfileForEdit(orgId);
      setProfileData(updatedProfile);

    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeSpeciality = (optionToRemove) => {
    const updatedSpecialities = watchedSpecialities.filter(
      (item) => item.value !== optionToRemove.value
    );
    setValue("specialities", updatedSpecialities);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className={styles.editTabSection}>
        <div className={styles.pageTitle}>
          <h1>Loading Profile Data...</h1>
          <p>Please wait while we fetch your organization information.</p>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.editTabSection}>
      <div className={styles.pageTitle}>
        <h1>Edit Information</h1>
        <p>Update your company's profile information</p>
      {/*   {profileData && (
          <small className={styles.dataStatus}>
            {profileData.orgName
              ? `Editing: ${profileData.orgName}`
              : "Complete your profile setup"}
          </small>
        )} */}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.basicDetails}>
          <h2>Basic Details</h2>
          <div className={styles.bd_container}>
            <div className={styles.inputfield}>
              <label>
                Organization's Name
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField
                {...register("orgName", {
                  required: "Organization name is required",
                  minLength: {
                    value: 3,
                    message: "Min 3 characters required",
                  },
                })}
                placeholder="Enter Organization's Name"
                layout="md"
              />
              <span className={styles.error}>{errors.orgName?.message}</span>
            </div>

            <div className={styles.inputfield}>
              <label>
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
                      clearErrors("district");
                    }}
                    value={field.value || null}
                  />
                )}
              />
              <span className={styles.error}>{errors.district?.message}</span>
            </div>

            <div className={styles.inputfield}>
              <label>
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
                placeholder="Enter Address"
                layout="md"
              />
              <span className={styles.error}>{errors.address?.message}</span>
            </div>

            <div className={styles.inputfield}>
              <label>
                Phone No.
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField
                {...register("phoneNo", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Phone number must be exactly 10 digits",
                  },
                })}
                placeholder="Enter Phone no"
                layout="md"
              />
              <span className={styles.error}>{errors.phoneNo?.message}</span>
            </div>

            <div className={styles.inputfield}>
              <label>
                E-mail
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Enter Organization's Email"
                layout="md"
              />
              <span className={styles.error}>{errors.email?.message}</span>
            </div>

            <div className={styles.inputfield}>
              <label>
                Founded Year
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <InputField
                {...register("foundedYear", {
                  required: "Founded year is required",
                  pattern: {
                    value: /^\d{4}$/,
                    message: "Please enter a valid 4-digit year",
                  },
                  min: {
                    value: 1800,
                    message: "Year must be after 1800",
                  },
                  max: {
                    value: new Date().getFullYear(),
                    message: "Year cannot be in the future",
                  },
                })}
                placeholder="Enter Founded Year"
                layout="md"
                type="number"
              />
              <span className={styles.error}>
                {errors.foundedYear?.message}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.companyInfo}>
          <h2>Company Information</h2>
          <div className={styles.ci_container}>
            <div className={styles.top}>
              {/* Industry Field - FIXED VERSION */}
              <div className={styles.inputfield}>
                <label>
                  Industry
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <Controller
                  name="industry"
                  control={control}
                  rules={{ required: "Industry is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      ref={industrySelectRef}
                      options={INDUSTRY_OPTIONS}
                      placeholder="Select industry"
                      onChange={(value) => {
                        console.log("Industry selected:", value);
                        field.onChange(value);
                        clearErrors("industry");
                      }}
                      value={field.value || null}
                    />
                  )}
                />
                <span className={styles.error}>
                  {errors.industry?.message}
                </span>
                {/* Debug info - remove this in production */}
                {watchedIndustry && (
                  <small style={{ color: "#666", fontSize: "12px" }}>
                    Selected: {getIndustryLabel(watchedIndustry)}
                  </small>
                )}
              </div>

              <div className={styles.selectfield}>
                <label>
                  Specialities
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <Controller
                  name="specialities"
                  control={control}
                  rules={{ required: "At least one speciality is required" }}
                  render={({ field }) => (
                    <MultiSelect
                      options={SKILL_OPTIONS}
                      placeholder="Select skills"
                      onChange={(options) => {
                        field.onChange(options);
                        handleMultipleSelect(options);
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
                  {watchedSpecialities && watchedSpecialities.length > 0 ? (
                    watchedSpecialities.map((option) => (
                      <span key={option.value} className={styles.tag}>
                        {option.label}
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeSpeciality(option)}
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

            {/* Rest of your form remains the same */}
            <div className={styles.middle}>
              <div className={styles.companySize}>
                <label className={styles.inputLabel}>Company Size</label>
                <Controller
                  name="companySize"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      options={sizeOptions}
                      name="companySize"
                      selectedValue={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        handleSizeTypeChange(value);
                      }}
                    />
                  )}
                />
                <div className={styles.minmax}>
                  <div className={styles.inputWrapper}>
                    <label>
                      Minimum
                      <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <InputField
                      {...register("minEmployees", {
                        required: "Minimum employees is required",
                        pattern: {
                          value: /^\d+$/,
                          message: "Please enter a valid number",
                        },
                      })}
                      layout="sm"
                      placeholder="eg. 10"
                      type="number"
                    />
                    <span className={styles.error}>
                      {errors.minEmployees?.message}
                    </span>
                  </div>

                  <div className={styles.inputWrapper}>
                    <label>Maximum</label>
                    <InputField
                      {...register("maxEmployees", {
                        pattern: {
                          value: /^\d+$/,
                          message: "Please enter a valid number",
                        },
                      })}
                      layout="sm"
                      placeholder="eg. 50"
                      type="number"
                      disabled={watchedCompanySize === "fixed"}
                      className={
                        watchedCompanySize === "fixed"
                          ? styles.disabledInput
                          : ""
                      }
                    />
                    <span className={styles.error}>
                      {errors.maxEmployees?.message}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.about}>
                <label>
                  About
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <TextArea
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message:
                        "Description must be at least 10 characters long",
                    },
                  })}
                  placeholder="Describe about your company"
                  rows={4}
                />
                <span className={styles.error}>
                  {errors.description?.message}
                </span>
              </div>
            </div>

            <div className={styles.bottom}>
              <label>
                Benefits
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <TextArea
                {...register("benefits", {
                  required: "Benefits information is required",
                })}
                placeholder="Competitive Salary and equity package
Health insurance coverage
Flexible working hours
Professional development opportunities"
                rows={4}
              />
              <span className={styles.error}>{errors.benefits?.message}</span>
          
              {convertBenefitsToArray(watch("benefits")).length > 0 && (
                <small style={{ color: "#666", fontSize: "12px" }}>
                  {convertBenefitsToArray(watch("benefits")).length} benefit(s)
                  will be saved
                </small>
              )}
            </div>
          </div>
        </div>

        <div className={styles.socialProfile}>
          <h2>Social Profile</h2>
          <div className={styles.sp_container}>
            <div className={styles.social}>
              <IconInstagram />
              <InputField
                {...register("socialProfile.instagram")}
                placeholder="eg. username"
                layout="fw"
              />
            </div>
            <div className={styles.social}>
              <IconFacebook />
              <InputField
                {...register("socialProfile.facebook")}
                placeholder="eg. username"
                layout="fw"
              />
            </div>
            <div className={styles.social}>
              <IconX />
              <InputField
                {...register("socialProfile.twitter")}
                placeholder="eg. username"
                layout="fw"
              />
            </div>
          </div>
        </div>

        <div className={styles.brandAssets}>
          <h2>Brand Assets</h2>
          <div className={styles.ba_container}>
            <div className={styles.addPhoto}>
              <div className={styles.logoContainer}>
                <Controller
                  name="companyLogo"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      id="companyLogo"
                      shape="circle"
                      imgFile={field.value}
                      onChange={(file) => field.onChange(file)}
                    />
                  )}
                />
                <div className={styles.rightSide}>
                  <label>Company Logo</label>
                  <Button
                    type="button"
                    layout="xs"
                    color="neutralLight"
                    fill="outline"
                    onClick={() => setValue("companyLogo", null)}
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
              <label>Cover Photo</label>
              <Controller
                name="companyCover"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    id="companyCover"
                    imgFile={field.value}
                    ImgUploadText="Upload Cover Photo"
                    onChange={(file) => field.onChange(file)}
                  />
                )}
              />
              <Button
                className={styles.removeBtns}
                type="button"
                layout="xs"
                color="neutralLight"
                fill="outline"
                onClick={() => setValue("companyCover", null)}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.buttons}>
          <Button 
            layout="sm" 
            fill="outline" 
            color="neutralLight" 
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button layout="sm" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </section>
  );
}