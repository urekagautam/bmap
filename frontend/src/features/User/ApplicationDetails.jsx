"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaDownload,
  FaBuilding,
  FaClock,
  FaChartBar,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClipboardList,
  FaUsers,
  FaHandshake,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa"
import OrganizationNavbar from "../../component/OrganizationNavbar"
import styles from "./ApplicationDetails.module.css"
import { apiGetApplicationDetails } from "../../services/apiAuth.js"
import { apiUpdateApplicationStatus } from "../../services/apiApplication.js"

function ApplicationDetails() {
  const { id: applicationId } = useParams()
  const navigate = useNavigate()

  const [applicationData, setApplicationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState("")

  console.log("Application ID from params:", applicationId)

  // Fetch application details on component mount
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true)
        const response = await apiGetApplicationDetails(applicationId)

        if (response.success) {
          setApplicationData(response.data)
          setSelectedStatus(response.data.status === "PENDING" ? "UNDER_REVIEW" : response.data.status)
        } else {
          setError("Failed to fetch application details")
        }
      } catch (error) {
        console.error("Error fetching application details:", error)
        setError("Failed to load application details")
      } finally {
        setLoading(false)
      }
    }

    if (applicationId) {
      fetchApplicationDetails()
    }
  }, [applicationId])

  const statusOptions = [
    {
      key: "UNDER_REVIEW",
      label: "Under Review",
      icon: FaFileAlt,
    },
    {
      key: "SHORTLISTED",
      label: "Shortlist",
      icon: FaClipboardList,
    },
    {
      key: "INTERVIEW",
      label: "Interview",
      icon: FaUsers,
    },
    {
      key: "HIRED",
      label: "Hire",
      icon: FaHandshake,
    },
    {
      key: "REJECTED",
      label: "Reject",
      icon: FaTimes,
    },
  ]

  const getStatusDisplay = (status) => {
    const statusMap = {
      PENDING: "Under Review",
      UNDER_REVIEW: "Under Review",
      SHORTLISTED: "Shortlisted",
      INTERVIEW: "Interview",
      HIRED: "Hired",
      REJECTED: "Rejected",
      0: "Applied",
      1: "Shortlisted",
      2: "Interview",
      3: "Rejected",
      4: "Hired",
      5: "Under Review",
    }
    return statusMap[status] || "Under Review"
  }

  const getStatusClass = (status) => {
    const statusClassMap = {
      PENDING: "pending",
      UNDER_REVIEW: "underReview",
      SHORTLISTED: "shortListed",
      INTERVIEW: "interviewScheduled",
      HIRED: "hired",
      REJECTED: "rejected",
      0: "pending",
      1: "shortListed",
      2: "interviewScheduled",
      3: "rejected",
      4: "hired",
      5: "underReview",
    }
    return styles[statusClassMap[status]] || styles.underReview
  }

  const formatJobByTime = (jobByTime) => {
    const formatMap = {
      fulltime: "Full-time",
      parttime: "Part-time",
      contract: "Contract",
      internship: "Internship",
      freelance: "Freelance",
    }
    return formatMap[jobByTime] || jobByTime
  }

  const formatJobByLocation = (jobByLocation) => {
    const formatMap = {
      on_site: "On-site/In-Office",
      remote: "Remote",
      hybrid: "Hybrid",
      none: "Not Specified",
    }
    return formatMap[jobByLocation] || jobByLocation
  }

  const formatJobLevel = (jobLevel) => {
    const formatMap = {
      "mid-level": "Mid level",
      senior: "Senior",
      intern: "Intern",
    }
    return formatMap[jobLevel] || jobLevel
  }

  const getDeadlineText = () => {
    if (!applicationData?.vacancy?.deadline) return "No deadline specified"

    const deadline = new Date(applicationData.vacancy.deadline)
    const now = new Date()
    const diffTime = deadline - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
      if (diffDays === 1) return "Apply before: 1 day from today"
      if (diffDays <= 7) return `Apply before: ${diffDays} days from today`
      const weeks = Math.floor(diffDays / 7)
      const remainingDays = diffDays % 7
      return `Apply before: ${weeks} week${weeks > 1 ? "s" : ""}${remainingDays > 0 ? `, ${remainingDays} day${remainingDays > 1 ? "s" : ""}` : ""} from today`
    } else {
      return "Deadline passed"
    }
  }

  const formatSalary = (salary, salaryPeriod) => {
    if (!salary) return "Not specified"

    if (salary.type === "fixed") {
      return `Rs. ${salary.min?.toLocaleString() || 0} ${salaryPeriod || "Monthly"}`
    } else if (salary.type === "range") {
      return `Rs. ${salary.min?.toLocaleString() || 0} - ${salary.max?.toLocaleString() || 0} ${salaryPeriod || "Monthly"}`
    }
    return "Not specified"
  }

  const formatExperience = (experienceCriteria, experience) => {
    if (!experienceCriteria || experienceCriteria === "N/A" || !experience || experience === "N/A") {
      return "Not specified"
    }

    const criteriaMap = {
      more_than: "More than",
      less_than: "Less than",
      more_than_or_equal_to: "More than or equal to",
      less_than_or_equal_to: "Less than or equal to",
      equal_to: "Equal to",
    }

    const experienceMap = {
      "1year": "1 year",
      "2years": "2 years",
      "3years": "3 years",
      "4years": "4 years",
      "5+years": "5+ years",
    }

    return `${criteriaMap[experienceCriteria] || experienceCriteria} ${experienceMap[experience] || experience}`
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleStatusChange = async (newStatus, event) => {
    // Prevent form submission and page refresh
    if (event) {
      event.preventDefault()
    }
    
    // Just update the selected status locally, don't make API call yet
    setSelectedStatus(newStatus)
    console.log("Status selected:", newStatus)
  }

  const handleSaveStatus = async (event) => {
    event.preventDefault()
    
    if (!selectedStatus) {
      console.log("No status selected")
      return
    }
    
    try {
      setLoading(true)
      console.log("Saving status:", selectedStatus)
      
      // Make API call to update the status
      const response = await apiUpdateApplicationStatus(applicationId, selectedStatus)
      
      if (response.success) {
        // Update the local state
        setApplicationData((prev) => ({
          ...prev,
          status: selectedStatus,
        }))
        console.log("Status saved successfully:", response)
        alert("Status updated successfully!")
      } else {
        console.error("Failed to save status:", response.message)
        alert("Failed to update status: " + (response.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error saving status:", error)
      let errorMessage = "Unknown error occurred"
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      alert("Error updating status: " + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <OrganizationNavbar />
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.dashboard}>
              <div className={styles.loading}>
                <p>Loading application details...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error || !applicationData) {
    return (
      <>
        <OrganizationNavbar />
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.dashboard}>
              <button onClick={handleBack} className={styles.backBtn}>
                <FaArrowLeft /> Back
              </button>
              <div className={styles.loading}>
                <p>{error || "Application not found"}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <OrganizationNavbar />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.dashboard}>
            {/* Back Button */}
            <button onClick={handleBack} className={styles.backBtn}>
              <FaArrowLeft /> Back
            </button>

            <div className={styles.mainContainer}>
              <div className={styles.formContainer}>
                {/* Header */}
                <div className={styles.pageTitle}>
                  <h1>Applied for {applicationData.vacancy.title}</h1>
                  <div className={styles.jobInfo}>
                    <span className={styles.row}>
                      <FaBuilding /> {applicationData.vacancy.department} •{" "}
                      {formatJobByTime(applicationData.vacancy.jobByTime)} •{" "}
                      {formatJobByLocation(applicationData.vacancy.jobByLocation)}
                    </span>
                  </div>
                                     <div className={styles.statusBadge}>
                     <span className={`${styles.statusTag} ${getStatusClass(selectedStatus)}`}>
                       {getStatusDisplay(selectedStatus)}
                     </span>
                     {selectedStatus && (
                       <span className={styles.statusNote}>
                         (Click Save to apply changes)
                       </span>
                     )}
                   </div>
                </div>

                {/* Personal Information */}
                <div className={styles.section}>
                  <h2>Personal Information</h2>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoRow}>
                      <div className={styles.infoItem}>
                        <FaUser className={styles.icon} />
                        <span>{applicationData.user.name}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <FaPhone className={styles.icon} />
                        <span>{applicationData.user.phone}</span>
                      </div>
                    </div>
                    <div className={styles.infoRow}>
                      <div className={styles.infoItem}>
                        <FaUser className={styles.icon} />
                        <span>
                          {applicationData.user.gender !== "N/A" ? applicationData.user.gender : "Not specified"}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <FaEnvelope className={styles.icon} />
                        <span>{applicationData.user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className={styles.section}>
                  <h2>Professional Information</h2>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoRow}>
                      <div className={styles.infoItem}>
                        <FaLinkedin className={styles.icon} />
                        <span>
                          {applicationData.user.socialProfile.linkedin !== "N/A"
                            ? applicationData.user.socialProfile.linkedin
                            : "Not provided"}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <FaGithub className={styles.icon} />
                        <span>
                          {applicationData.user.socialProfile.github !== "N/A"
                            ? applicationData.user.socialProfile.github
                            : "Not provided"}
                        </span>
                      </div>
                    </div>
                    <div className={styles.infoRow}>
                      <div className={styles.infoItem}>
                        <FaGlobe className={styles.icon} />
                        <span>
                          {applicationData.user.socialProfile.portfolio !== "N/A"
                            ? applicationData.user.socialProfile.portfolio
                            : "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className={styles.section}>
                  <h2>Documents</h2>
                  <div className={styles.documentsContainer}>
                    <div className={styles.documentItem}>
                      <h4>Resume/ CV</h4>
                      <div className={styles.documentFile}>
                        <span className={styles.fileName}>
                          {applicationData.user.name.replace(/\s+/g, "_")}_Resume.pdf
                        </span>
                        <span className={styles.fileInfo}>Document Link: {applicationData.documents}</span>
                        <button className={styles.downloadBtn}>
                           Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className={styles.section}>
                  <h2>Additional Information</h2>
                  <div className={styles.additionalInfo}>
                    <div className={styles.questionAnswer}>
                      <h4>Why does this position appeal to you?</h4>
                      <p>{applicationData.description}</p>
                    </div>
                    <div className={styles.salaryExpectation}>
                      <FaMoneyBillWave className={styles.icon} />
                      <span>Expected Salary: Rs. {applicationData.salaryExpectations}</span>
                    </div>
                  </div>
                </div>

                                {/* Status Selection */}
                <form onSubmit={(e) => e.preventDefault()} className={styles.statusSelection}>
                  <div className={styles.statusOptions}>
                    {statusOptions.map((option) => {
                      const IconComponent = option.icon
                      return (
                        <button
                          key={option.key}
                          className={`${styles.statusOption} ${
                            selectedStatus === option.key ? styles.statusOptionActive : ""
                          }`}
                          onClick={(event) => handleStatusChange(option.key, event)}
                          disabled={loading}
                          type="button"
                        >
                          <IconComponent className={styles.statusIcon} />
                          <span>{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                  <button 
                    className={styles.viewProfileBtn} 
                    onClick={handleSaveStatus}
                    disabled={loading || !selectedStatus}
                    type="button"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </form>
              </div>

              {/* Job Details Sidebar */}
              <div className={styles.jobDetailsContainer}>
                <h3>Job Details</h3>
                <div className={styles.detailsList}>
                  <div className={styles.detailItem}>
                    <FaBuilding className={styles.icon} />
                    <span>{applicationData.vacancy.department}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaChartBar className={styles.icon} />
                    <span>{formatJobLevel(applicationData.vacancy.jobLevel)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaClock className={styles.icon} />
                    <span>{formatJobByTime(applicationData.vacancy.jobByTime)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaChartBar className={styles.icon} />
                    <span>
                      {formatExperience(applicationData.vacancy.experienceCriteria, applicationData.vacancy.experience)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaMoneyBillWave className={styles.icon} />
                    <span>{formatSalary(applicationData.vacancy.salary, applicationData.vacancy.salaryPeriod)}</span>
                  </div>
                </div>
                <div className={styles.deadline}>
                  <FaCalendarAlt className={styles.icon} />
                  <span>{getDeadlineText()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ApplicationDetails
