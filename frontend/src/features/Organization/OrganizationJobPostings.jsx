"use client"
import { useState, useEffect } from "react"
import { FaEye, FaEdit } from "react-icons/fa"
import { Link } from "react-router-dom"
import OrganizationNavbar from "../../component/OrganizationNavbar"
import SideBar from "./SideBar" 
import useOrgAuth from "../../hooks/useOrgAuth"
import { apiGetOrganizationJobListings } from "../../services/apiAuth.js"
import styles from "./OrganizationApplications.module.css" 

function OrganizationJobPostings() {
  const { orgId } = useOrgAuth()
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJobListings = async () => {
      if (!orgId) return

      try {
        setLoading(true)
        console.log("Fetching job listings for orgId:", orgId)
        const response = await apiGetOrganizationJobListings(orgId)

        if (response.success) {
          console.log("Job listings received:", response.data)
          setVacancies(response.data)
        } else {
          setError("Failed to load job listings")
        }
      } catch (err) {
        console.error("Error fetching job listings:", err)
        setError("Failed to load job listings")
      } finally {
        setLoading(false)
      }
    }

    fetchJobListings()
  }, [orgId])

  return (
    <>
      <OrganizationNavbar />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {/* ✅ SAME SIDEBAR PATTERN AS APPLICATIONS */}
          <SideBar activeMenu="jobpostings" />
          <div className={styles.dashboard}>
            <div className={styles.header}>
              <div>
                <h1>Job Postings</h1>
                <p className={styles.subtitle}>Manage and track your posted jobs.</p>
              </div>
              <div className={styles.actions}>
                <Link to="/postjob">
                  <button className={styles.postJobBtn}>Post a Job</button>
                </Link>
              
              </div>
            </div>

            {loading && <div className={styles.loading}>Loading job postings...</div>}
            {error && <div className={styles.error}>{error}</div>}

            {!loading && !error && (
              <div className={styles.jobListContainer}>
                {vacancies.length === 0 ? (
                  <div className={styles.noJobs}>No job postings found. Create your first job posting!</div>
                ) : (
                  <div className={styles.jobList}>
                    {vacancies.map((vacancy) => (
                      <div key={vacancy.vacancyId} className={styles.jobCard}>
                        <div className={styles.jobInfo}>
                          <div className={styles.jobTitle}>
                            <h3>{vacancy.title}</h3>
                            <span
                              className={`${styles.status} ${vacancy.status === "OPEN" ? styles.open : styles.closed}`}
                            >
                              {vacancy.status}
                            </span>
                          </div>
                          {/* ✅ SIMILAR TO APPLICATIONS BUT WITH BOTH EYE AND EDIT */}
                          <div className={styles.timeAndAction}>
                            <p className={styles.postedTime}>Posted {vacancy.timeAgo}</p>
                            <div className={styles.actionButtons}>
                              <Link
                                to={`/jobdescription/${vacancy.vacancyId}`}
                                className={styles.viewBtn}
                                title="View Job Details"
                              >
                                <FaEye />
                              </Link>
                              {/* <Link
                                to={`/updatevacancy/${vacancy.vacancyId}`}
                                className={styles.editBtn}
                                title="Edit Job"
                              >
                                <FaEdit />
                              </Link> */}
                            </div>
                          </div>
                        </div>
                        {/* ✅ NO APPLICATION COUNT FOR JOB POSTINGS */}
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

export default OrganizationJobPostings
