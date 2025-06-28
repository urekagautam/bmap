import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import styles from "./JobApplicationDetails.module.css"
import { IconBack } from "../../component/icons/IconBack"
import { IconOrganizationBuilding } from "../../component/icons/IconOrganizationBuilding"
import { IconLocationPinned } from "../../component/icons/IconLocationPinned"
import InputField from "../../component/InputField"
import { IconInvalid } from "../../component/icons/IconInvalid"
import { IconLinkedIn } from "../../component/icons/IconLinkedIn"
import { IconGithub } from "../../component/icons/IconGithub"
import { IconBills } from "../../component/icons/IconBills"
import { IconChartLinedUp } from "../../component/icons/IconChartLinedUp"
import { IconChartBar } from "../../component/icons/IconChartBar"
import { IconClock } from "../../component/icons/IconClock"
import { IconHourglass } from "../../component/icons/IconHourglass"
import TextArea from "../../component/TextArea"
import Button from "../../component/Button"
import { IconWeb } from "../../component/icons/IconWeb"
import { apiGetUserDataForApplication, apiUpdateUserProfileForApplication, apiSubmitJobApplication } from "../../services/apiAuth"
import { apiGetJobDetailsForApplication } from "../../services/apiVacancy"
import useUserAuth from "../../hooks/useUserAuth"

export default function JobApplicationDetails() {
  const { id: jobId } = useParams()
  const { userId } = useUserAuth()

  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingUserData, setIsLoadingUserData] = useState(true)
  const [isLoadingJobData, setIsLoadingJobData] = useState(true)
  const [jobDetails, setJobDetails] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      linkedin: "",
      github: "",
      portfolio: "",
      jobDescription: "",
      salaryExpectations: "",
    },
  })

  //   // Fetching user details
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setIsLoadingUserData(false)
        return
      }

      try {
        setIsLoadingUserData(true)
        console.log("Fetching user data for ID:", userId)

        const response = await apiGetUserDataForApplication(userId)
        const userData = response.data

        console.log("Fetched user data:", userData)

        const nameParts = userData.name ? userData.name.trim().split(" ") : ["", ""]
        const firstName = nameParts[0] || ""
        const lastName = nameParts.slice(1).join(" ") || ""

        setValue("firstName", firstName)
        setValue("lastName", lastName)
        setValue("email", userData.email || "")
        setValue("phoneNo", userData.phoneNo || "")
        setValue("linkedin", userData.socialProfile?.linkedin || "")
        setValue("github", userData.socialProfile?.github || "")
        setValue("portfolio", userData.socialProfile?.portfolio || "")
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to load user data. You can still fill the form manually.")
      } finally {
        setIsLoadingUserData(false)
      }
    }

    fetchUserData()
  }, [userId, setValue])

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setIsLoadingJobData(false)
        return
      }

      try {
        setIsLoadingJobData(true)
        console.log("Fetching job details for ID:", jobId)

        const response = await apiGetJobDetailsForApplication(jobId)
        const jobData = response.data

        console.log("Fetched job data:", jobData)
        setJobDetails(jobData)
      } catch (error) {
        console.error("Error fetching job details:", error)
        toast.error("Failed to load job details")
      } finally {
        setIsLoadingJobData(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

  // Helper function to format salary
  const formatSalary = () => {
    if (!jobDetails?.salaryMin && !jobDetails?.salaryMax) return null

    if (jobDetails.salaryMin && jobDetails.salaryMax) {
      return `${jobDetails.salaryMin} - ${jobDetails.salaryMax}`
    } else if (jobDetails.salaryMin) {
      return `${jobDetails.salaryMin}+`
    } else if (jobDetails.salaryMax) {
      return `Up to ${jobDetails.salaryMax}`
    }
    return null
  }

  // Helper function to format deadline
  const formatDeadline = () => {
    if (!jobDetails?.deadline) return null

    const deadlineDate = new Date(jobDetails.deadline)
    const now = new Date()
    const diffTime = deadlineDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
      return `${diffDays} days from now`
    } else if (diffDays === 0) {
      return "Today"
    } else {
      return "Expired"
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)

      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNo: data.phoneNo,
        linkedin: data.linkedin,
        github: data.github,
        portfolio: data.portfolio,
      }

      console.log("Updating profile with:", profileData)
      await apiUpdateUserProfileForApplication(userId, profileData)

      const applicationData = {
        userId: userId,
        jobId: jobId,
        orgId: data.orgId,
        jobDescription: data.jobDescription,
        salaryExpectations: data.salaryExpectations ? Number.parseInt(data.salaryExpectations) : 0,
      }

      console.log("Submitting application with:", applicationData)
      await apiSubmitJobApplication(applicationData)

      toast.success("Application submitted successfully!")
      setTimeout(() => {
        navigate("/jobs")
      }, 1000)
    } catch (error) {
      console.error("Error submitting application:", error)
      const errorMessage = error.response?.data?.message || "Failed to submit application"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isLoadingUserData || isLoadingJobData) {
    return (
      <section className={styles.postjobSection}>
        <div className={styles.mainContainer}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Loading...</p>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (!jobDetails) {
    return (
      <section className={styles.postjobSection}>
        <div className={styles.mainContainer}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Job not found</p>
            <Button onClick={() => navigate("/jobs")}>Back to Jobs</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.postjobSection}>
      <Link to={`/view-jobdescription/${jobId}`} className={styles.backBtn}>
        <IconBack /> Back
      </Link>

      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <div className={styles.pageTitle}>
            <h1>Apply For {jobDetails.title}</h1>
            {jobDetails.industry && (
              <span className={styles.row}>
                <IconOrganizationBuilding /> {jobDetails.industry}
              </span>
            )}
            {jobDetails.location && (
              <span className={styles.row}>
                <IconLocationPinned /> {jobDetails.location}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.jobDetails}>
              <h2>Personal Information</h2>
              <p className={styles.styleInfo}>
                <IconInvalid /> Any changes you make here will be reflected in your main profile automatically!
              </p>

              <div className={styles.jd_container}>
                <div className={styles.inputRow}>
                  <div className={styles.inputField}>
                    <label className={styles.fieldLabel}>
                      First Name
                      <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <InputField
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
                      placeholder="Enter First Name"
                    />
                    <span className={styles.error}>{errors.firstName?.message}</span>
                  </div>

                  <div className={styles.inputField}>
                    <label className={styles.fieldLabel}>
                      Last Name
                      <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <InputField
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
                      placeholder="Enter Last Name"
                    />
                    <span className={styles.error}>{errors.lastName?.message}</span>
                  </div>

                  <div className={styles.inputField}>
                    <label className={styles.fieldLabel}>
                      Email<span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <InputField
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      placeholder="Enter E-mail"
                    />
                    <span className={styles.error}>{errors.email?.message}</span>
                  </div>
                </div>

                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    Phone No.<span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <div className={styles.inputRow}>
                    <InputField
                      layout="md"
                      {...register("phoneNo", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Please enter a valid 10-digit phone number",
                        },
                      })}
                      placeholder="Enter Phone No."
                    />
                  </div>
                  <span className={styles.error}>{errors.phoneNo?.message}</span>
                </div>
              </div>
            </div>

            <div className={styles.jobDetails}>
              <h2>Professional Information</h2>

              <div className={styles.sp_container}>
                <div className={styles.socialRow}>
                  <div className={styles.social}>
                    <IconLinkedIn />
                    <InputField
                      {...register("linkedin", {
                        pattern: {
                          value: /^[a-zA-Z0-9._-]+$/,
                          message: "Please enter a valid LinkedIn username",
                        },
                      })}
                      placeholder="e.g : your.username"
                      layout="fw"
                    />
                  </div>

                  <div className={styles.social}>
                    <IconGithub />
                    <InputField
                      {...register("github", {
                        pattern: {
                          value: /^[a-zA-Z0-9._-]+$/,
                          message: "Please enter a valid GitHub username",
                        },
                      })}
                      placeholder="e.g : your.username"
                      layout="fw"
                    />
                  </div>
                </div>

                <div className={styles.socialRow}>
                  <div className={styles.social}>
                    <IconWeb />
                    <InputField
                      {...register("portfolio", {
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: "Please enter a valid URL",
                        },
                      })}
                      placeholder="e.g  https://yourportfolio.com"
                      layout="fw"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.jobDetails}>
              <h2>Additional Information</h2>

              <div className={styles.ai_container}>
                <div className={styles.about}>
                  <label className={styles.inputLabel}>
                    Why do you want this job?
                    <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <Controller
                    name="jobDescription"
                    control={control}
                    rules={{
                      required: "This field is required",
                      minLength: {
                        value: 50,
                        message: "Please provide at least 50 characters",
                      },
                      maxLength: {
                        value: 500,
                        message: "Maximum 500 characters allowed",
                      },
                    }}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        placeholder="e.g., I'm passionate about this field and eager to contribute"
                        rows={4}
                      />
                    )}
                  />
                  <span className={styles.error}>{errors.jobDescription?.message}</span>
                </div>

                <div className={styles.inputField}>
                  <label className={styles.fieldLabel}>Salary Expectations</label>
                  <InputField
                    {...register("salaryExpectations", {
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Please enter a valid number",
                      },
                      validate: (value) => !value || Number.parseInt(value) > 0 || "Salary must be greater than 0",
                    })}
                    placeholder="Enter Salary Expectations"
                  />
                  <span className={styles.error}>{errors.salaryExpectations?.message}</span>
                </div>
              </div>
            </div>

            <div className={styles.buttons}>
              <Button type="button" layout="sm" fill="outline" color="neutralLight" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" layout="sm" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>

        <div className={styles.jobDetailsContainer}>
          <h3>Job Details</h3>

          <div className={styles.detailsList}>
            {jobDetails.industry && (
              <span className={styles.row2}>
                <IconOrganizationBuilding /> {jobDetails.industry}
              </span>
            )}
            {jobDetails.jobLevel && (
              <span className={styles.row2}>
                <IconChartBar /> {jobDetails.jobLevel}
              </span>
            )}
            {jobDetails.location && (
              <span className={styles.row2}>
                <IconLocationPinned /> {jobDetails.location}
              </span>
            )}
            {jobDetails.jobByTime && (
              <span className={styles.row2}>
                <IconClock /> {jobDetails.jobByTime}
              </span>
            )}
            {jobDetails.experienceCriteria && jobDetails.experience && (
              <span className={styles.row2}>
                <IconChartLinedUp /> {jobDetails.experienceCriteria} {jobDetails.experience}
              </span>
            )}
            {formatSalary() && (
              <span className={styles.row2}>
                <IconBills /> {formatSalary()} {jobDetails.salaryPeriod}
              </span>
            )}
          </div>

          {formatDeadline() && (
            <span className={styles.row3}>
              <IconHourglass />
              Apply Before: {formatDeadline()}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
