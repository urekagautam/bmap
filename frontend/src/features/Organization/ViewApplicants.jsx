"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import OrganizationNavbar from "../../component/OrganizationNavbar"
import SideBar from "./SideBar"
import { apiGetVacancyApplications } from "../../services/apiAuth"
import styles from "./ViewApplicants.module.css"

function ViewApplicants() {
  const { id: vacancyId } = useParams()
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [vacancyData, setVacancyData] = useState(null)

  console.log("Vacancy ID from params:", vacancyId)

  useEffect(() => {
    const fetchApplications = async () => {
      if (!vacancyId) return

      try {
        setLoading(true)
        setError(null)
        console.log("Fetching applications for vacancy ID:", vacancyId)

        const response = await apiGetVacancyApplications(vacancyId)

        if (response.success) {
          console.log("Applications received:", response.data)
          setApplications(response.data.applications)
          setVacancyData(response.data.vacancy)
        } else {
          setError("Failed to load applications")
        }
      } catch (err) {
        console.error("Error fetching applications:", err)
        setError("Failed to load applications")
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [vacancyId])

  const getTimeAgo = (date) => {
    const now = new Date()
    const applicationDate = new Date(date)
    const diffInMinutes = Math.floor((now - applicationDate) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hr ago`
    if (diffInMinutes < 10080) {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} ${days === 1 ? "day" : "days"} ago`
    }
    const weeks = Math.floor(diffInMinutes / 10080)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  }

  const getStatusDisplay = (status) => {
    const statusMap = {
      PENDING: "Pending",
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
    return statusMap[status] || "Applied"
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
    return statusClassMap[status] || "pending"
  }

  const getVacancyStatusInfo = () => {
    if (!vacancyData) return null

    const hiredCount = applications.filter((app) => app.status === 4).length
    const remainingPositions = Math.max(0, vacancyData.requiredEmployees - hiredCount)

    const now = new Date()
    const deadlinePassed = vacancyData.deadline && new Date(vacancyData.deadline) <= now

    return {
      hiredCount,
      remainingPositions,
      deadlinePassed,
      isOpen: vacancyData.isVacancyOpen,
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const vacancyStatusInfo = getVacancyStatusInfo()

  return (
    <>
      <OrganizationNavbar />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <SideBar activeMenu="applications" />

          <div className={styles.dashboard}>
            {/* Back Button */}
            <div className={styles.backSection}>
              <button onClick={handleBack} className={styles.backButton}>
                <FaArrowLeft />
                <span>Back to Job Listings</span>
              </button>
            </div>

            {/* Header */}
            <div className={styles.header}>
              <div>
                <h1>{vacancyData?.title || "Loading..."}</h1>
                <p className={styles.subtitle}>Review & Manage Applications.</p>
                <p className={styles.vacancyId}>Vacancy ID: {vacancyId}</p>

                {/* Vacancy Status Info */}
                {vacancyStatusInfo && (
                  <div className={styles.vacancyStatusInfo}>
                    <div
                      className={`${styles.vacancyStatus} ${vacancyStatusInfo.isOpen ? styles.open : styles.closed}`}
                    >
                      <span className={styles.statusIndicator}>
                        {vacancyStatusInfo.isOpen ? "🟢 OPEN" : "🔴 CLOSED"}
                      </span>
                      <span className={styles.positionInfo}>
                        {vacancyStatusInfo.hiredCount}/{vacancyData.requiredEmployees} positions filled
                      </span>
                      {vacancyStatusInfo.remainingPositions > 0 && vacancyStatusInfo.isOpen && (
                        <span className={styles.remainingInfo}>({vacancyStatusInfo.remainingPositions} remaining)</span>
                      )}
                      {vacancyStatusInfo.deadlinePassed && (
                        <span className={styles.deadlineInfo}>(Deadline passed)</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.actions}>
                <button className={styles.viewApplicationsBtn}>Total Applications ({applications.length})</button>
              </div>
            </div>

            {loading && <div className={styles.loading}>Loading applications...</div>}
            {error && <div className={styles.error}>{error}</div>}

            {!loading && !error && (
              <div className={styles.applicationsContainer}>
                {applications.length === 0 ? (
                  <div className={styles.noApplications}>No applications received for this position yet.</div>
                ) : (
                  <div className={styles.applicationsList}>
                    {applications.map((application) => (
                      <div key={application.id} className={styles.applicationCard}>
                        <div className={styles.applicantInfo}>
                          <img
                            src={application.user.image || "/RandomImage.png"}
                            alt={application.user.name}
                            className={styles.applicantImage}
                          />
                          <div className={styles.applicantDetails}>
                            <strong className={styles.applicantName}>{application.user.name}</strong>
                          </div>
                        </div>

                        <div className={styles.applicationMeta}>
                          <span className={styles.timeAgo}>{getTimeAgo(application.createdAt)}</span>

                          {/* Replace the entire select element with this simple status badge */}
                          <span className={`${styles.statusBadge} ${styles[getStatusClass(application.status)]}`}>
                            {getStatusDisplay(application.status)}
                          </span>

                          <Link to={`/applicationDetails/${application.id}`} className={styles.viewButton}>
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewApplicants
