"use client"

import { useState, useEffect } from "react"
import OrganizationNavbar from "../../component/OrganizationNavbar"
import styles from "./OrganizationDashboard.module.css"
import useOrgAuth from "../../hooks/useOrgAuth.js"
import { apiUpdateOrganizationLocation, apiOrganizationGetProfile } from "../../services/apiOrganizationAuth.js"
import { apiGetApplicationsByOrg, apiGetDashboardStats } from "../../services/apiApplication.js"
import { FaBriefcase } from "react-icons/fa"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
import Button from "../../component/Button.jsx"
import SideBar from "./SideBar.jsx"
import { Link } from "react-router-dom"
import MapComponent from "../../component/MapComponent.jsx"

function OrganizationDashboard() {
  const { orgId } = useOrgAuth()

  // Location states
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [checkingLocation, setCheckingLocation] = useState(true)
  const [showMap, setShowMap] = useState(false) // State to control map visibility
  const [searchQuery, setSearchQuery] = useState("") // State for search input
  const [tempCoordinates, setTempCoordinates] = useState(null) // Store coordinates from MapComponent

  // Recent applications states
  const [recentApplications, setRecentApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [applicationsError, setApplicationsError] = useState(null)

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    underReview: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
    rejected: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState(null)

  // Session validity check on mount
  useEffect(() => {
    const orgId = localStorage.getItem("orgId")
    if (orgId) {
      apiOrganizationGetProfile(orgId).catch(() => {
        // The API service will handle logout and redirect
      })
    } else {
      localStorage.clear()
      window.location.href = "/org/login"
    }
  }, [])

  // Check organization's location from database
  useEffect(() => {
    const checkOrganizationLocation = async () => {
      if (!orgId) {
        console.log("No orgId found")
        setCheckingLocation(false)
        return
      }

      console.log("🔍 Checking location for orgId:", orgId)

      const cachedOrgId = localStorage.getItem("locationOrgId")
      const cachedLocation = localStorage.getItem("orgLocation")

      console.log("📦 Cached orgId:", cachedOrgId)
      console.log("📦 Current orgId:", orgId)
      console.log("📦 Cache match:", cachedOrgId === orgId)

      if (cachedOrgId === orgId && cachedLocation) {
        try {
          const parsedLocation = JSON.parse(cachedLocation)
          if (
            parsedLocation.lat &&
            parsedLocation.lng &&
            typeof parsedLocation.lat === "number" &&
            typeof parsedLocation.lng === "number"
          ) {
            console.log("✅ Using cached organization location:", parsedLocation)
            setLocation(parsedLocation)
            setCheckingLocation(false)
            return
          }
        } catch (e) {
          console.error("❌ Error parsing cached organization location:", e)
          localStorage.removeItem("orgLocation")
          localStorage.removeItem("locationOrgId")
        }
      } else if (cachedOrgId && cachedOrgId !== orgId) {
        console.log("🧹 Clearing cache for different organization")
        localStorage.removeItem("orgLocation")
        localStorage.removeItem("locationOrgId")
      }

      try {
        console.log("🔍 Checking database for organization location...")
        const response = await apiOrganizationGetProfile(orgId)

        console.log("📡 Organization profile response:", response)

        if (
          response.success &&
          response.data.location?.lat &&
          response.data.location?.lng &&
          typeof response.data.location.lat === "number" &&
          typeof response.data.location.lng === "number"
        ) {
          const dbLocation = {
            lat: response.data.location.lat,
            lng: response.data.location.lng,
          }
          console.log("✅ Found organization location in database:", dbLocation)
          setLocation(dbLocation)
          localStorage.setItem("orgLocation", JSON.stringify(dbLocation))
          localStorage.setItem("locationOrgId", orgId)
        } else {
          console.log("❌ No location found in database for organization")
          setLocation(null)
          localStorage.removeItem("orgLocation")
          localStorage.removeItem("locationOrgId")
        }
      } catch (error) {
        console.error("❌ Error checking organization location:", error)
        setLocation(null)
        localStorage.removeItem("orgLocation")
        localStorage.removeItem("locationOrgId")
      } finally {
        setCheckingLocation(false)
      }
    }

    checkOrganizationLocation()
  }, [orgId])

  // Fetch recent applications
  useEffect(() => {
    const fetchRecentApplications = async () => {
      if (!orgId) {
        setApplicationsLoading(false)
        return
      }

      setApplicationsLoading(true)
      setApplicationsError(null)
      try {
        const response = await apiGetApplicationsByOrg(orgId)
        if (response.success && Array.isArray(response.data)) {
          setRecentApplications(response.data)
        } else {
          throw new Error(response.message || "Failed to fetch applications")
        }
      } catch (error) {
        console.error("Error fetching recent applications:", error)
        setApplicationsError(error.message || "Could not load recent applications.")
      } finally {
        setApplicationsLoading(false)
      }
    }

    fetchRecentApplications()
  }, [orgId])

  // Compute status counts from recentApplications
  useEffect(() => {
    if (!recentApplications || recentApplications.length === 0) return;
    const counts = { underReview: 0, shortlisted: 0, interview: 0, hired: 0, rejected: 0 };
    recentApplications.forEach(app => {
      switch (app.status) {
        case 5:
        case 'UNDER_REVIEW':
        case 'Under Review':
          counts.underReview++;
          break;
        case 1:
        case 'SHORTLISTED':
        case 'Shortlisted':
        case 'Shortlist':
          counts.shortlisted++;
          break;
        case 2:
        case 'INTERVIEW':
        case 'Interview':
          counts.interview++;
          break;
        case 4:
        case 'HIRED':
        case 'Hired':
        case 'Hire':
          counts.hired++;
          break;
        case 3:
        case 'REJECTED':
        case 'Rejected':
        case 'Reject':
          counts.rejected++;
          break;
        default:
          break;
      }
    });
    setDashboardStats(counts);
  }, [recentApplications]);

  useEffect(() => {
    async function fetchStats() {
      if (!orgId) return
      setStatsLoading(true)
      setStatsError(null)
      try {
        const response = await apiGetDashboardStats(orgId)
        if (response.success) {
          setDashboardStats(response.data)
        } else {
          setStatsError(response.message || "Failed to fetch stats")
        }
      } catch (error) {
        setStatsError(error.message || "Failed to fetch stats")
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [orgId])

  // Handle coordinates selected from MapComponent
  const handleCoordinatesChange = (coords) => {
    console.log("📍 Received coordinates from MapComponent:", coords)
    setTempCoordinates(coords)
  }

  // Save selected coordinates to database
  const handleSaveLocation = async () => {
    if (!orgId) {
      setLocationError("Organization not found. Please log in again.")
      setShowMap(false)
      return
    }

    if (!tempCoordinates) {
      setLocationError("No location selected. Please search for a location.")
      setShowMap(false)
      return
    }

    setLocationLoading(true)
    setLocationError(null)

    console.log("🚀 Calling apiUpdateOrganizationLocation with:", { orgId, coords: tempCoordinates })

    try {
      const response = await apiUpdateOrganizationLocation(orgId, tempCoordinates)

      console.log("📡 Raw API response:", response)
      console.log("📡 Response success:", response?.success)
      console.log("📡 Response data:", response?.data)
      console.log("📡 Response message:", response?.message)

      if (response && response.success) {
        console.log("✅ API call successful, setting location to:", tempCoordinates)
        setLocation(tempCoordinates)
        localStorage.setItem("orgLocation", JSON.stringify(tempCoordinates))
        localStorage.setItem("locationOrgId", orgId)
        console.log("✅ Organization location enabled and saved successfully!")
        setShowMap(false)
        setSearchQuery("")
        setTempCoordinates(null)
      } else {
        console.error("❌ API call failed:", response)
        throw new Error(response?.message || "Failed to save organization location to database")
      }
    } catch (error) {
      console.error("❌ Error saving organization location:", error)
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      })
      setLocationError(`Failed to save location: ${error.message}`)
      setLocation(null)
    } finally {
      setLocationLoading(false)
    }
  }

  // Show map and search input when "Enable Location" or "Update Location" is clicked
  const handleEnableLocation = () => {
    setShowMap(true)
    setLocationError(null)
    setSearchQuery("")
    setTempCoordinates(null)
  }

  // Close map without saving
  const handleCloseMap = () => {
    setShowMap(false)
    setLocationError(null)
    setSearchQuery("")
    setTempCoordinates(null)
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Pie chart data
  const pieData = [
    { name: 'Under Review', value: dashboardStats.underReview },
    { name: 'Shortlist', value: dashboardStats.shortlisted },
    { name: 'Interview', value: dashboardStats.interview },
    { name: 'Hire', value: dashboardStats.hired },
    { name: 'Reject', value: dashboardStats.rejected },
  ]

  const COLORS = ["#E3D888", "#9D75F0", "#387ADF", "#50C878", "#F55050"]

  return (
    <>
      <OrganizationNavbar />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <SideBar />
          <div className={styles.dashboard}>
            <div className={styles.header}>
              <h1>BMAP Dashboard</h1>
              <div className={styles.actions}>
                <Link to="/postjob">
                  <Button fill="fill" layout="sm" color="neutral" className={styles.actionBtn}>
                    Post a Job
                  </Button>
                </Link>
                {checkingLocation ? (
                  <Button fill="fill" layout="sm" color="neutral" className={styles.actionBtn} disabled>
                    Checking Location...
                  </Button>
                ) : location ? (
                  <Button
                    fill="fill"
                    layout="sm"
                    color="primary"
                    className={styles.actionBtn}
                    onClick={handleEnableLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? "Saving Location..." : "Update Location"}
                  </Button>
                ) : (
                  <Button
                    fill="fill"
                    layout="sm"
                    color="primary"
                    className={styles.actionBtn}
                    onClick={handleEnableLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? "Saving Location..." : "Enable Location"}
                  </Button>
                )}
              </div>
            </div>

            {/* Show search input and map for location selection */}
            {showMap && (
              <div className={styles.mapSection}>
                <div style={{ marginBottom: "10px" }}>
                  <h3>Select Location</h3>
                  <p>Enter a location to preview it on the map, then save to confirm.</p>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search for a location (e.g., Kathmandu, Nepal)"
                    className={styles.searchInput}
                    disabled={locationLoading}
                  />
                </div>
                <MapComponent
                  location={searchQuery}
                  onCoordinatesChange={handleCoordinatesChange}
                />
                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                  <Button
                    fill="fill"
                    layout="sm"
                    color="primary"
                    className={styles.actionBtn}
                    onClick={handleSaveLocation}
                    disabled={locationLoading || !tempCoordinates}
                  >
                    {locationLoading ? "Saving..." : "Save Location"}
                  </Button>
                  <Button
                    fill="outline"
                    layout="sm"
                    color="neutral"
                    className={styles.actionBtn}
                    onClick={handleCloseMap}
                    disabled={locationLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {locationError && (
              <div className={styles.locationError}>
                <p style={{ color: "#f55050", fontSize: "14px", marginBottom: "10px" }}>{locationError}</p>
              </div>
            )}

            {location && (
              <div className={styles.locationInfo}>
                <p style={{ color: "#28a745", fontSize: "14px", marginBottom: "10px" }}>
                  📍 Location enabled - Your organization can now be found by nearby job seekers!
                </p>
               {/*  {location.lat && location.lng && (
                  <p style={{ color: "#666", fontSize: "12px" }}>
                    Debug: Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)} (OrgId: {orgId})
                  </p>
                )} */}
                {(!location.lat || !location.lng) && (
                  <p style={{ color: "#f55050", fontSize: "12px" }}>
                    Debug: Invalid location data - Lat: {location.lat || "undefined"}, Lng:{" "}
                    {location.lng || "undefined"}
                  </p>
                )}
              </div>
            )}

            {checkingLocation && (
              <div className={styles.locationInfo}>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "10px" }}>
                  🔍 Checking location for organization...
                </p>
              </div>
            )}

            <div className={styles.stats}>
              <div className={styles.statBox}>
                <div className={styles.insideStatBox}>
                  <p>Under Review</p>
                  <div className={styles.statIcon}>
                    <FaBriefcase />
                  </div>
                </div>
                <span>{statsLoading ? '...' : dashboardStats.underReview}</span>
              </div>
              <div className={styles.statBox}>
                <div className={styles.insideStatBox}>
                  <p>Shortlist</p>
                  <div className={styles.statIcon}>
                    <FaBriefcase />
                  </div>
                </div>
                <span>{statsLoading ? '...' : dashboardStats.shortlisted}</span>
              </div>
              <div className={styles.statBox}>
                <div className={styles.insideStatBox}>
                  <p>Interview</p>
                  <div className={styles.statIcon}>
                    <FaBriefcase />
                  </div>
                </div>
                <span>{statsLoading ? '...' : dashboardStats.interview}</span>
              </div>
              <div className={styles.statBox}>
                <div className={styles.insideStatBox}>
                  <p>Hire</p>
                  <div className={styles.statIcon}>
                    <FaBriefcase />
                  </div>
                </div>
                <span>{statsLoading ? '...' : dashboardStats.hired}</span>
              </div>
              <div className={styles.statBox}>
                <div className={styles.insideStatBox}>
                  <p>Reject</p>
                  <div className={styles.statIcon}>
                    <FaBriefcase />
                  </div>
                </div>
                <span>{statsLoading ? '...' : dashboardStats.rejected}</span>
              </div>
            </div>

            <div className={styles.content}>
              <div className={styles.recentApps}>
                <h2>Recent Applications</h2>
                <p>See who applied most recently.</p>
                {applicationsLoading ? (
                  <p>Loading recent applications...</p>
                ) : applicationsError ? (
                  <p style={{ color: "red" }}>{applicationsError}</p>
                ) : recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <div key={app._id} className={styles.applicationItem}>
                      <div className={styles.applicantInfo}>
                        <div className={styles.applicantAvatar}>
                          {app.user_id?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className={styles.applicantName}>
                            {app.user_id?.name || "Unknown Applicant"}
                          </p>
                          <p className={styles.jobTitle}>
                            Applied for {app.vacancy_id?.title || "Unknown Job"}
                          </p>
                        </div>
                      </div>
                      <div className={styles.applicationMeta}>
                        <p className={styles.applyDate}>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                        <Link
                          to={`/applicationDetails/${app._id}`}
                          className={styles.viewLink}
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No recent applications found.</p>
                )}
                <Link to="/orgJobApplications">
                  <Button layout="fw" fill="outline">
                    View All Applications
                  </Button>
                </Link>
              </div>

              <div className={styles.jobPerformance}>
                <div className={styles.pieChartSection}>
                  <div className={styles.pieChartHeader}>
                    <h2>Job Performance</h2>
                    <p>Track and evaluate job effectiveness.</p>
                  </div>
                  {(() => {
                    return (
                      <PieChart width={400} height={300}>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    );
                  })()}
                </div>
                <div className={styles.legend}>
                  <div><span style={{ background: "#E3D888" }}></span> Under Review</div>
                  <div><span style={{ background: "#9D75F0" }}></span> Shortlist</div>
                  <div><span style={{ background: "#387ADF" }}></span> Interview</div>
                  <div><span style={{ background: "#50C878" }}></span> Hire</div>
                  <div><span style={{ background: "#F55050" }}></span> Reject</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrganizationDashboard