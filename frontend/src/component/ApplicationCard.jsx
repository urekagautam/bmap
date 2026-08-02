"use client"

import { useNavigate } from "react-router-dom"
import styles from "./ApplicationCard.module.css"
import { IconClock } from "./icons/IconClock"
import { IconEyeOpen } from "./icons/IconEyeOpen"
import Tag from "./Tag.jsx"

export default function ApplicationCard({
  jobTitle = "-",
  appliedCompany = "-",
  status = 0, // Default to 0 (Applied)
  appliedDate = "-",
  timeLabel = "-",
  onView = null,
  vacancyId = null,
}) {
  const navigate = useNavigate()
  const userImageUrl = "/CompanyProfileImage.png"

  // Updated status mapping to match your requirements
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Applied"
      case 1:
        return "Shortlisted"
      case 2:
        return "Interview"
      case 3:
        return "Rejected"
      case 4:
        return "Hired"
      default:
        return "Applied"
    }
  }

  // Get appropriate color for status
  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "blue" // Applied
      case 1:
        return "yellow" // Shortlisted
      case 2:
        return "orange" // Interview
      case 3:
        return "red" // Rejected
      case 4:
        return "green" // Hired
      default:
        return "blue"
    }
  }

  const statusLabel = getStatusLabel(status)
  const statusColor = getStatusColor(status)

  const handleViewClick = async (e) => {
    e.preventDefault()

    // Only navigate to job description page - no status update
    if (vacancyId) {
      navigate(`/view-jobdescription/${vacancyId}`)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPart}>
        <div className={styles.topPart}>
          <div className={styles.userImage}>
            <img src={userImageUrl || "/placeholder.svg"} alt="User" />
          </div>
          <div className={styles.userDetails}>
            <span>{jobTitle}</span>
            <span>{appliedCompany}</span>
          </div>
        </div>
        <div className={styles.bottomPart}>
          <Tag data={statusLabel} color={statusColor} size="md" />
          <Tag data={timeLabel} icon={<IconClock />} />
          <span className={styles.lastApplied}>{appliedDate}</span>
        </div>
      </div>
      <button onClick={handleViewClick} className={styles.viewButton}>
        <IconEyeOpen />
      </button>
    </div>
  )
}
