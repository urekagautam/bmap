import { useState, useEffect } from "react"
import styles from "./JobsTab.module.css"
import Button from "../../../component/Button.jsx"
import JobCard from "../../../component/JobCard.jsx"
import { Link } from "react-router-dom"
import { apiGetOrgVacancies } from "../../../services/apiVacancy.js"
import { useOrgData } from "../../../hooks/useOrgData.js"

export default function JobsTab({ orgId }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { orgData } = useOrgData(orgId)

  useEffect(() => {
    const fetchJobs = async () => {
      if (!orgId) {
        setError("Organization ID not provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await apiGetOrgVacancies(orgId)
        
        if (response.success && response.data) {
          setJobs(response.data)
        } else {
          setJobs([])
        }
      } catch (err) {
        console.error("Error fetching organization jobs:", err)
        setError("Failed to load jobs")
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [orgId])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Current Vacancies</h1>
            <p className={styles.subtitle}>Loading jobs...</p>
          </div>
        </div>
        <div className={styles.loadingState}>
          <p>Loading job listings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Current Vacancies</h1>
            <p className={styles.subtitle}>Error loading jobs</p>
          </div>
        </div>
        <div className={styles.errorState}>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Current Vacancies</h1>
            <p className={styles.subtitle}>
              {orgData?.orgName ? `No current openings at ${orgData.orgName}` : "No current job openings"}
            </p>
          </div>
        </div>
        <div className={styles.emptyState}>
          <p>This organization currently has no job postings.</p>
          <p>Check back later for new opportunities!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Current Vacancies</h1>
          <p className={styles.subtitle}>
            {orgData?.orgName ? `See who we're looking for at ${orgData.orgName}` : "Current job openings"}
          </p>
        </div>
      </div>

      <div className={styles.jobGrid}>
        {jobs.map((job) => (
          <JobCard
            key={job._id || job.id}
            title={job.title}
            company={orgData?.orgName || job.company}
            location={job.location || "Location not specified"}
            skills={job.skills || []}
            level={job.level}
            salaryMin={job.salaryMin}
            salaryMax={job.salaryMax}
            jobType={job.jobType}
            jobMode={job.jobMode}
            experienceLevel={job.experienceLevel}
            experienceDuration={job.experienceDuration}
            deadline={job.deadline}
            views={job.views || 0}
            jobId={job._id || job.id}
            organizationId={orgId}
            logoSrc={orgData?.avatarUrl}
            // New props for actual data structure
            salary={job.salary}
            jobByTime={job.jobByTime}
            jobByLocation={job.jobByLocation}
            jobLevel={job.jobLevel}
            experience={job.experience}
            skillsRequired={job.skillsRequired || []}
            department={job.department}
          />
        ))}
      </div>
    </div>
  )
}