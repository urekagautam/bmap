import { useForm, Controller } from "react-hook-form"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Button from "../../../component/Button.jsx"
import ImageUpload from "../../../component/ImageUpload.jsx"
import styles from "./EditInformation.module.css"
import InputField from "../../../component/InputField"
import Select from "../../../component/Select"
import { IconLinkedIn } from "../../../component/icons/IconLinkedIn.jsx"
import { IconX } from "../../../component/icons/IconX.jsx"
import { IconWeb } from "../../../component/icons/IconWeb.jsx"
import { IconFacebook } from "../../../component/icons/IconFacebook.jsx"
import { IconInstagram } from "../../../component/icons/IconInstagram.jsx"
import { IconGithub } from "../../../component/icons/IconGithub.jsx"
import {
  DISTRICT_OPTIONS,
  FIELD_OF_EXPERTISE_OPTIONS,
  GENDER_OPTIONS,
  JOB_BY_LEVEL,
  JOB_BY_LOCATION,
  JOB_BY_TIME,
  JOB_BY_TITLE,
  SKILL_OPTIONS,
} from "../../../constants/constants"
import RadioGroup from "../../../component/RadioGroup"
import MultiSelect from "../../../component/MultiSelect"
import { IconCross } from "../../../component/icons/IconCross"
import TextArea from "../../../component/TextArea"
import { apiGetUserProfile, apiUpdateUserProfile } from "../../../services/apiAuth.js"
import useUserAuth from "../../../hooks/useUserAuth.js"
import { convertSkillsToOptions } from "../../../utils/dataHelpers.js"

export default function EditInformation({ onCancel, onSuccess }) {
  const { userId, token, isAuthenticated, isLoading: authLoading } = useUserAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [companyLogo, setCompanyLogo] = useState(null)

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
      firstName: "",
      lastName: "",
      address: "",
      district: "",
      phoneNumber: "",
      email: "",
      gender: "M",
      fieldOfInterest: "",
      skills: [],
      about: "",
      preferredJobTitle: "",
      jobByTime: "fulltime",
      jobByLocation: "on_site",
      jobLevel: "mid-level",
      socialProfile: {
        instagram: "",
        facebook: "",
        x: "",
        linkedin: "",
        github: "",
        portfolio: "",
      },
    },
  })

  const selectedSkills = watch("skills") || []

  const findOption = (value, options) => {
    if (!value) return null
    if (typeof value === "object") return value
    return options.find((option) => option.value === value || option.label === value) || null
  }

  useEffect(() => {
    const loadUserData = async () => {
   
      if (authLoading) {
        console.log("Auth still loading...")
        return
      }

      // Checking authentication after loading is complete
      if (!isAuthenticated || !userId) {
        console.log("User not authenticated after auth loading completed")
        toast.error("User not authenticated")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        console.log("Loading user data for userId:", userId)

        const response = await apiGetUserProfile(userId)

        if (response?.data) {
          const userData = response.data
          const fullName = userData.name || ""
          const [firstName, ...lastNameParts] = fullName.split(" ")
          const lastName = lastNameParts.join(" ")

          const districtValue = findOption(userData.district, DISTRICT_OPTIONS)
          const fieldOfInterestValue = findOption(userData.field_of_interest, FIELD_OF_EXPERTISE_OPTIONS)
          const preferredJobTitleValue = findOption(userData.job_preference?.title, JOB_BY_TITLE)

          const skillsValue = convertSkillsToOptions(userData.job_preference?.skills || [])

          reset({
            firstName: firstName || "",
            lastName: lastName || "",
            address: userData.address || "",
            district: districtValue || "",
            phoneNumber: userData.phone || "",
            email: userData.email || "",
            gender: userData.gender || "M",
            fieldOfInterest: fieldOfInterestValue || "",
            skills: skillsValue,
            about: userData.about || "",
            preferredJobTitle: preferredJobTitleValue || "",
            jobByTime: userData.job_preference?.job_by_time || "fulltime",
            jobByLocation: userData.job_preference?.job_by_location || "on_site",
            jobLevel: userData.job_preference?.job_level || "mid-level",
            socialProfile: {
              instagram: userData.socialProfile?.insta || "",
              facebook: userData.socialProfile?.fb || "",
              x: userData.socialProfile?.x || "",
              linkedin: userData.socialProfile?.linkedin || "",
              github: userData.socialProfile?.github || "",
              portfolio: userData.socialProfile?.portfolio || "",
            },
          })

          console.log("User data loaded successfully")
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        toast.error("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [userId, isAuthenticated, authLoading, reset])

  const handleRemoveImage = () => {
    setCompanyLogo(null)
  }

  const handleSkillChange = (skills) => {
    setValue("skills", skills)
    clearErrors("skills")
  }

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = selectedSkills.filter((skill) => skill.value !== skillToRemove.value)
    setValue("skills", updatedSkills)
  }

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)

      const updateData = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        address: data.address,
        district: typeof data.district === "object" ? data.district.value : data.district,
        phone: data.phoneNumber,
        email: data.email,
        gender: data.gender,
        field_of_interest: typeof data.fieldOfInterest === "object" ? data.fieldOfInterest.value : data.fieldOfInterest,
        about: data.about,
        job_preference: {
          title: typeof data.preferredJobTitle === "object" ? data.preferredJobTitle.value : data.preferredJobTitle,
          job_by_time: data.jobByTime,
          job_by_location: data.jobByLocation,
          job_level: data.jobLevel,
          skills: data.skills.map((skill) => skill.value || skill),
        },
        socialProfile: {
          insta: data.socialProfile.instagram,
          fb: data.socialProfile.facebook,
          x: data.socialProfile.x,
          linkedin: data.socialProfile.linkedin,
          github: data.socialProfile.github,
          portfolio: data.socialProfile.portfolio,
        },
      }

      console.log("Updating user profile with data:", updateData)

      const response = await apiUpdateUserProfile(userId, updateData)
      console.log("Update response:", response)

      toast.success("Profile updated successfully!")

      // Calling the success callback to switch back to about tab and refresh data
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error?.message || "Failed to update profile"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Showing loading while auth is loading or data is loading
  if (authLoading || isLoading) {
    return (
      <section className={styles.editContainer}>
        <div className={styles.loadingContainer}>
          <p>Loading user information...</p>
        </div>
      </section>
    )
  }

  // Showing error if not authenticated after loading
  if (!isAuthenticated || !userId) {
    return (
      <section className={styles.editContainer}>
        <div className={styles.loadingContainer}>
          <p>Please log in to edit your profile.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.editContainer}>
      <div className={styles.pageTitle}>
        <h1>Edit User Information</h1>
        <p>Update user's profile information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
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
                  <Button type="button" layout="xs" color="neutralLight" fill="outline" onClick={handleRemoveImage}>
                    Remove
                  </Button>
                </div>
              </div>
              <span>Recommended: Square image, at least 300x300 pixels, JPG or PNG format</span>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.smallInputs}>
                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    First Name
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField
                    layout="sm"
                    placeholder="Enter First Name"
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters long",
                      },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "First name should only contain letters",
                      },
                    })}
                  />
                  <span className={styles.error}>{errors.firstName?.message}</span>
                </div>

                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Last Name
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <InputField
                    layout="sm"
                    placeholder="Enter Last Name"
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters long",
                      },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Last name should only contain letters",
                      },
                    })}
                  />
                  <span className={styles.error}>{errors.lastName?.message}</span>
                </div>
              </div>

              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>
                  Address
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <InputField
                  placeholder="Enter Address"
                  {...register("address", {
                    required: "Address is required",
                    minLength: {
                      value: 5,
                      message: "Address must be at least 5 characters long",
                    },
                  })}
                />
                <span className={styles.error}>{errors.address?.message}</span>
              </div>

              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>
                  District
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <Controller
                  name="district"
                  control={control}
                  rules={{ required: "District is required" }}
                  render={({ field }) => (
                    <Select
                      options={DISTRICT_OPTIONS}
                      placeholder="Select district"
                      onChange={(value) => {
                        field.onChange(value)
                        clearErrors("district")
                      }}
                      value={field.value || null}
                    />
                  )}
                />
                <span className={styles.error}>{errors.district?.message}</span>
              </div>
            </div>

            <div className={styles.inputRow2}>
              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>
                  Phone Number
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <InputField
                  placeholder="Enter Phone Number"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  })}
                />
                <span className={styles.error}>{errors.phoneNumber?.message}</span>
              </div>

              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>
                  E-mail
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <InputField
                  type="email"
                  placeholder="Enter E-mail"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <span className={styles.error}>{errors.email?.message}</span>
              </div>

              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>
                  Gender
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      name="gender"
                      options={GENDER_OPTIONS}
                      selectedValue={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
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
                <Controller
                  name="fieldOfInterest"
                  control={control}
                  rules={{ required: "Field of interest is required" }}
                  render={({ field }) => (
                    <Select
                      options={FIELD_OF_EXPERTISE_OPTIONS}
                      placeholder="Select preferred category"
                      onChange={(value) => {
                        field.onChange(value)
                        clearErrors("fieldOfInterest")
                      }}
                      value={field.value || null}
                    />
                  )}
                />
                <span className={styles.error}>{errors.fieldOfInterest?.message}</span>
              </div>

              <div className={styles.selectfield}>
                <label className={styles.fieldLabel}>
                  Skills
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <Controller
                  name="skills"
                  control={control}
                  rules={{
                    required: "At least one skill is required",
                    validate: {
                      minThree: (value) => value.length >= 3 || "At least 3 skills are required",
                      maxTen: (value) => value.length <= 10 || "Maximum 10 skills allowed",
                    },
                  }}
                  render={({ field }) => (
                    <MultiSelect
                      options={SKILL_OPTIONS}
                      placeholder="Select skills"
                      onChange={(skills) => {
                        field.onChange(skills)
                        clearErrors("skills")
                      }}
                      defaultValues={field.value}
                    />
                  )}
                />
                <span className={styles.error}>{errors.skills?.message}</span>
              </div>

              <div className={styles.selectedTags}>
                <h2>Selected Skills</h2>
                <div className={styles.tagsContainer}>
                  {selectedSkills.length > 0 ? (
                    selectedSkills.map((skill) => (
                      <span key={skill.value} className={styles.tag}>
                        {skill.label}
                        <button type="button" className={styles.removeBtn} onClick={() => handleRemoveSkill(skill)}>
                          <IconCross />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className={styles.noSkillsText}>No skills selected yet</span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.about}>
              <label className={styles.fieldLabel}>
                About<span className={styles.requiredAsterisk}>*</span>
              </label>
              <Controller
                name="about"
                control={control}
                rules={{
                  required: "About section is required",
                  minLength: {
                    value: 50,
                    message: "About section should be at least 50 characters",
                  },
                  maxLength: {
                    value: 500,
                    message: "About section should not exceed 500 characters",
                  },
                }}
                render={({ field }) => <TextArea {...field} placeholder="Describe about yourself" rows={4} />}
              />
              <span className={styles.error}>{errors.about?.message}</span>
            </div>
          </div>
        </div>

        <div className={styles.jobDetails}>
          <h2>Job Details</h2>
          <div className={styles.jd_container}>
            <div className={styles.top}>
              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>
                  Preferred Job Title
                  <span className={styles.requiredAsterisk}>*</span>
                </label>
                <Controller
                  name="preferredJobTitle"
                  control={control}
                  rules={{ required: "Preferred job title is required" }}
                  render={({ field }) => (
                    <Select
                      options={JOB_BY_TITLE}
                      placeholder="Select job title"
                      onChange={(value) => {
                        field.onChange(value)
                        clearErrors("preferredJobTitle")
                      }}
                      value={field.value || null}
                    />
                  )}
                />
                <span className={styles.error}>{errors.preferredJobTitle?.message}</span>
              </div>

              <div className={styles.jobbyDetails}>
                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Job Type <span className={styles.subTitle}>(by time)</span>
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <Controller
                    name="jobByTime"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        name="jobByTime"
                        options={JOB_BY_TIME}
                        selectedValue={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    <span className={styles.subTitle}>(by location)</span>
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <Controller
                    name="jobByLocation"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        name="jobByLocation"
                        options={JOB_BY_LOCATION}
                        selectedValue={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className={styles.inputField}>
              <label className={styles.fieldLabel}>
                Job Level
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <Controller
                name="jobLevel"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    name="jobLevel"
                    options={JOB_BY_LEVEL}
                    selectedValue={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
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
                <InputField
                  placeholder="eg. username"
                  {...register("socialProfile.instagram", {
                    pattern: {
                      value: /^[a-zA-Z0-9._]+$/,
                      message: "Invalid Instagram username",
                    },
                  })}
                />
                <span className={styles.error}>{errors.socialProfile?.instagram?.message}</span>
              </div>

              <div className={styles.social}>
                <IconFacebook />
                <InputField placeholder="eg. username" {...register("socialProfile.facebook")} />
              </div>

              <div className={styles.social}>
                <IconX />
                <InputField
                  placeholder="eg. username"
                  {...register("socialProfile.x", {
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Invalid X (Twitter) username",
                    },
                  })}
                />
                <span className={styles.error}>{errors.socialProfile?.x?.message}</span>
              </div>
            </div>

            <div className={styles.socialRow}>
              <div className={styles.social}>
                <IconLinkedIn />
                <InputField placeholder="eg. username" {...register("socialProfile.linkedin")} />
              </div>

              <div className={styles.social}>
                <IconGithub />
                <InputField
                  placeholder="eg. username"
                  {...register("socialProfile.github", {
                    pattern: {
                      value: /^[a-zA-Z0-9-]+$/,
                      message: "Invalid GitHub username",
                    },
                  })}
                />
                <span className={styles.error}>{errors.socialProfile?.github?.message}</span>
              </div>

              <div className={styles.social}>
                <IconWeb />
                <InputField
                  placeholder="e.g https://yourportfolio.com"
                  {...register("socialProfile.portfolio", {
                    pattern: {
                      value: /^https?:\/\/.+\..+/,
                      message: "Please enter a valid URL (starting with http:// or https://)",
                    },
                  })}
                />
                <span className={styles.error}>{errors.socialProfile?.portfolio?.message}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttons}>
          <Button type="button" layout="sm" fill="outline" color="neutralLight" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" layout="sm" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </section>
  )
}
