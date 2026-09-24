"use client"

import { useState, useEffect } from "react"
import { FaEye } from "react-icons/fa"
import { Link } from "react-router-dom"
import OrganizationNavbar from "../../component/OrganizationNavbar"
import SideBar from "./SideBar"
import useOrgAuth from "../../hooks/useOrgAuth"
import { apiGetOrganizationVacancies } from "../../services/apiAuth.js"
import styles from "./OrganizationApplications.module.css"

function OrganizationApplications() {
  const { orgId } = useOrgAuth()
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVacancies = async () => {
      if (!orgId) return

      try {
        setLoading(true)
        console.log("Fetching vacancies for orgId:", orgId)
        const response = await apiGetOrganizationVacancies(orgId)
        if (response.success) {
          console.log("Vacancies received:", response.data)
          setVacancies(response.data)
        } else {
          setError("Failed to load job postings")
        }
      } catch (err) {
        console.error("Error fetching vacancies:", err)
        setError("Failed to load job postings")
      } finally {
        setLoading(false)
      }
    }

    fetchVacancies()
  }, [orgId])

  // Helper function to get vacancy status with proper logic
  const getVacancyStatus = (vacancy) => {
    const now = new Date()
    const deadlinePassed = vacancy.deadline && new Date(vacancy.deadline) <= now

    // Vacancy is CLOSED if:
    // 1. isVacancyOpen is false (positions filled or manually closed), OR
    // 2. Deadline has passed
    if (vacancy.isVacancyOpen === false || deadlinePassed) {
      return "CLOSED"
    }

    return "OPEN"
  }

  return (
    <>
      <OrganizationNavbar />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <SideBar activeMenu="applications" />
          <div className={styles.dashboard}>
            <div className={styles.header}>
              <div>
                <h1>Job Applications</h1>
                <p className={styles.subtitle}>List of applications for your jobs posted, based on recents.</p>
              </div>
            </div>

            {loading && <div className={styles.loading}>Loading job postings...</div>}
            {error && <div className={styles.error}>{error}</div>}

            {!loading && !error && (
              <div className={styles.jobListContainer}>
                {vacancies.length === 0 ? (
                  <div className={styles.noJobs}>No Applicants found for your job postings.</div>
                ) : (
                  <div className={styles.jobList}>
                    {vacancies.map((vacancy) => {
                      const vacancyStatus = getVacancyStatus(vacancy)

                      return (
                        <div key={vacancy.vacancyId} className={styles.jobCard}>
                          {/* Top section with title/status on left, time/eye on right */}
                          <div className={styles.jobInfo}>
                            <div className={styles.jobTitle}>
                              <h3>{vacancy.title}</h3>
                              <div className={styles.statusContainer}>
                                <span
                                  className={`${styles.status} ${vacancyStatus === "OPEN" ? styles.open : styles.closed}`}
                                >
                                  {vacancyStatus}
                                </span>
                              </div>
                            </div>
                            {/* Time and eye icon on the right */}
                            <div className={styles.timeAndAction}>
                              <p className={styles.postedTime}>Posted {vacancy.timeAgo}</p>
                              <Link
                                to={`/viewApplicants/${vacancy.vacancyId}`}
                                className={styles.viewBtn}
                                title="View Applications"
                              >
                                <FaEye />
                              </Link>
                            </div>
                          </div>
                          {/* Bottom section with application count */}
                          <div className={styles.jobActions}>
                            <div className={styles.applicationCount}>
                              {vacancy.applicantCount} application{vacancy.applicantCount !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      )
                    })}
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

export default OrganizationApplications
