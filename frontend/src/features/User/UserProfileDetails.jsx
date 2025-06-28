import styles from "./UserProfileDetails.module.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { cns } from "../../utils/classNames.js"
import Tag from "../../component/Tag.jsx"
import Button from "../../component/Button.jsx"
import { IconOrganizationBuilding } from "../../component/icons/IconOrganizationBuilding.jsx"
import { IconPencil } from "../../component/icons/IconPencil"
import { IconChartBar } from "../../component/icons/IconChartBar"
import { IconLocationPinned } from "../../component/icons/IconLocationPinned"
import { IconPhone } from "../../component/icons/IconPhone"
import { IconFile } from "../../component/icons/IconFile"
import { IconEnvelope } from "../../component/icons/IconEnvelope"
import { IconInstagram } from "../../component/icons/IconInstagram"
import { IconFacebook } from "../../component/icons/IconFacebook"
import { IconLinkedIn } from "../../component/icons/IconLinkedIn"
import { IconGithub } from "../../component/icons/IconGithub"
import { IconWeb } from "../../component/icons/IconWeb"
import { IconX } from "../../component/icons/IconX"
import { IconStar } from "../../component/icons/IconStar.jsx"
import { IconHome } from "../../component/icons/IconHome.jsx"
import { apiGetUserProfile } from "../../services/apiAuth.js"
import useUserAuth from "../../hooks/useUserAuth.js"
import EditInformation from "./profile/EditInformation.jsx"
import ApplicationCard from "../../component/ApplicationCard.jsx"
import { IconUpload } from "../../component/icons/IconUpload.jsx"
import { IconUserList } from "../../component/icons/IconUserList.jsx"
import {
  convertSkillsToLabels,
  getJobTitleLabel,
  getJobTimeLabel,
  getJobLocationLabel,
  getJobLevelLabel,
  getDistrictLabel,
  getSocialMediaUrls,
} from "../../utils/dataHelpers.js"

export default function UserProfileDetails() {
  const { userId, isAuthenticated, token } = useUserAuth()
  const [activeTab, setActiveTab] = useState("about")
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !userId) {
        setError("User not authenticated or userId not found")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log("Fetching profile for userId:", userId)
        console.log("Is authenticated:", isAuthenticated)
        console.log("Token exists:", !!token)

        const response = await apiGetUserProfile(userId)
        console.log("API Response:", response)

        if (!response || !response.data) {
          throw new Error("Invalid response structure from API")
        }

        const rawData = response.data

        // Transforming data with proper label mapping
        const transformedData = {
          fullName: rawData.name || "Unknown User",
          jobTitle: getJobTitleLabel(rawData.job_preference?.title) || "Preferred Job Title not specified",
          jobLevel: getJobLevelLabel(rawData.job_preference?.job_level) || "Job Level not specified",
          jobByTime: getJobTimeLabel(rawData.job_preference?.job_by_time) || "Job Time not specified",
          jobByLocation: getJobLocationLabel(rawData.job_preference?.job_by_location) || "Job Location not specified",
          employeeCount: "1 (Individual)",
          address: rawData.address || "Address not provided",
          district: getDistrictLabel(rawData.district) || "District not provided",
          phoneNum: rawData.phone || "Phone not provided",
          email: rawData.email || "Email not provided",
          socialProfile: getSocialMediaUrls(rawData.socialProfile),
          aboutUser: rawData.about || "No information provided about this user.",
          skills: convertSkillsToLabels(rawData.job_preference?.skills || []),
          rawSocialProfile: rawData.socialProfile, // Keep raw data for checking if username exists
        }

        setUserData(transformedData)
      } catch (err) {
        console.error("Error fetching user profile:", err)

        if (err.response?.status === 401) {
          setError("Authentication failed. Please login again.")
        } else if (err.response?.status === 404) {
          setError("User profile not found.")
        } else if (err.response?.status >= 500) {
          setError("Server error. Please try again later.")
        } else {
          setError(err.message || "Failed to fetch user profile")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId, isAuthenticated, token])

  // Loading state
  if (loading) {
    return (
      <section className={styles.userProfileSection}>
        <div className={styles.mainWrapper}>
          <div className={styles.loadingContainer}>
            <p>Loading user profile...</p>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className={styles.userProfileSection}>
        <div className={styles.mainWrapper}>
          <div className={styles.errorContainer}>
            <p>Error: {error}</p>
            <Button layout="xs" color="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (!userData) {
    return (
      <section className={styles.userProfileSection}>
        <div className={styles.mainWrapper}>
          <div className={styles.noDataContainer}>
            <p>No user data available</p>
          </div>
        </div>
      </section>
    )
  }

  const firstName = userData.fullName.split(" ")[0]
  const userImageUrl = "/CompanyProfileImage.png"

  const handleEditComplete = async (shouldRefreshData = false) => {
    setActiveTab("about")

    // If data was updated, refresh the profile data
    if (shouldRefreshData) {
      try {
        setLoading(true)
        const response = await apiGetUserProfile(userId)

        if (response?.data) {
          const rawData = response.data
          
          const transformedData = {
            fullName: rawData.name || "Unknown User",
            jobTitle: getJobTitleLabel(rawData.job_preference?.title) || "Preferred Job Title not specified",
            jobLevel: getJobLevelLabel(rawData.job_preference?.job_level) || "Job Level not specified",
            jobByTime: getJobTimeLabel(rawData.job_preference?.job_by_time) || "Job Time not specified",
            jobByLocation: getJobLocationLabel(rawData.job_preference?.job_by_location) || "Job Location not specified",
            employeeCount: "1 (Individual)",
            address: rawData.address || "Address not provided",
            district: getDistrictLabel(rawData.district) || "District not provided",
            phoneNum: rawData.phone || "Phone not provided",
            email: rawData.email || "Email not provided",
            socialProfile: getSocialMediaUrls(rawData.socialProfile),
            aboutUser: rawData.about || "No information provided about this user.",
            skills: convertSkillsToLabels(rawData.job_preference?.skills || []),
            rawSocialProfile: rawData.socialProfile, 
          }
          setUserData(transformedData)
        }
      } catch (error) {
        console.error("Error refreshing user data:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <section className={styles.userProfileSection}>
      <div className={styles.mainWrapper}>
        <div className={styles.topContainer}>
          <div className={styles.leftPart}>
            <div className={styles.userImage}>
              <img src={userImageUrl || "/placeholder.svg"} alt="User" />
            </div>
            <div className={styles.userDetails}>
              <span>{userData.fullName}</span>
              <span>
                {userData.address}, {userData.district}
              </span>
            </div>
          </div>
          <Button
            className={cns(styles.edittab, activeTab === "edittab" && styles.activeEditTab)}
            onClick={() => setActiveTab("edittab")}
            fill="outline"
            layout="xs"
            color="neutral"
          >
            <IconPencil style={{ fontSize: "2rem" }} /> Edit Profile
          </Button>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={cns(styles.tab, activeTab === "about" && styles.activeTab)}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            type="button"
            className={cns(styles.tab, activeTab === "resume" && styles.activeTab)}
            onClick={() => setActiveTab("resume")}
          >
            Resume
          </button>
          <button
            type="button"
            className={cns(styles.tab, activeTab === "application" && styles.activeTab)}
            onClick={() => setActiveTab("application")}
          >
            Application
          </button>
        </div>

        {activeTab !== "edittab" && (
          <div className={styles.mainContainer}>
            {activeTab === "about" && (
              <div>
                <div className={styles.aboutUserWrapper}>
                  <div className={styles.allItems}>
                    <div className={styles.topItems}>
                      <div className={styles.item}>
                        <span className={styles.itemTitle}>
                          <IconUserList />
                          Preferred Job Title
                        </span>
                        <span>{userData.jobTitle}</span>
                      </div>
                      <div className={styles.item}>
                        <span className={styles.itemTitle}>
                          <IconChartBar />
                          Job Level
                        </span>
                        <span>{userData.jobLevel}</span>
                      </div>
                    </div>

                    <div className={styles.bottomItems}>
                      <div className={styles.item}>
                        <span className={styles.itemTitle}>
                          <IconOrganizationBuilding />
                          Job Type (by location)
                        </span>
                        <span>{userData.jobByLocation}</span>
                      </div>
                      <div className={styles.item}>
                        <span className={styles.itemTitle}>
                          <IconLocationPinned />
                          (by time)
                        </span>
                        <span>{userData.jobByTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.aboutUserWrapper}>
                  <h2>About {firstName}</h2>
                  <p>{userData.aboutUser}</p>
                  <div className={styles.skillsContainer}>
                    <div className={styles.skillsHeader}>
                      <IconOrganizationBuilding />
                      <h4>Key Skills:</h4>
                    </div>
                    <div className={styles.skillsTags}>
                      {userData.skills && Array.isArray(userData.skills) ? (
                        userData.skills.length > 0 ? (
                          userData.skills.map((skill, index) => (
                            <Tag key={index} data={skill} layout="primary" color="neutral" size="md" />
                          ))
                        ) : (
                          <p className={styles.notAvailable}>Not provided</p>
                        )
                      ) : (
                        <p className={styles.notAvailable}>Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "resume" && (
              <div className={styles.userResumeWrapper}>
                <div className={styles.title}>
                  <h2>Resume</h2>
                  <Button color="neutralLight" fill="outline" layout="xs">
                    <IconUpload />
                    Upload
                  </Button>
                </div>
                <div className={styles.container}>
                  <div className={styles.filename}>
                    <IconFile />
                    <p>Ureka_Gautam.pdf</p>
                  </div>
                  <p>Uploaded on May 15, 2023 . 2.4 MB</p>
                  <div className={styles.buttons}>
                    <Link to="/">
                      <Button layout="xs">Preview</Button>
                    </Link>
                    <Link to="/">
                      <Button layout="xs" fill="outline" color="neutralLight">
                        Delete
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "application" && (
              <div className={styles.userApplicationsWrapper}>
                <h2>Applications</h2>
                <p>Stay organized with your job hunt</p>
                <div className={styles.applicationCards}>
                  <ApplicationCard />
                  <ApplicationCard />
                  <ApplicationCard />
                </div>
              </div>
            )}

            <div className={styles.companyOtherInfo}>
              <h2>User Information</h2>
              <div className={styles.infoList}>
                <span>
                  <IconStar />
                  {userData.jobTitle}
                </span>
                <span className={styles.showLocation}>
                  <span className={styles.locationDetails}>
                    <IconHome />
                    {userData.address}
                  </span>
                </span>
                <span>
                  <IconPhone />
                  {userData.phoneNum}
                </span>
                <span>
                  <IconEnvelope />
                  {userData.email}
                </span>
              </div>

              <div className={styles.socialInfo}>
                <h4>Social Media</h4>
                <div className={styles.socialsList}>
                  {userData?.rawSocialProfile?.insta && (
                    <a href={userData.socialProfile.instagram} target="_blank" rel="noopener noreferrer">
                      <IconInstagram platform="instagram" />
                    </a>
                  )}
                  {userData?.rawSocialProfile?.fb && (
                    <a href={userData.socialProfile.facebook} target="_blank" rel="noopener noreferrer">
                      <IconFacebook platform="facebook" />
                    </a>
                  )}
                  {userData?.rawSocialProfile?.x && (
                    <a href={userData.socialProfile.x} target="_blank" rel="noopener noreferrer">
                      <IconX platform="x" />
                    </a>
                  )}
                  {userData?.rawSocialProfile?.portfolio && (
                    <a href={userData.socialProfile.portfolio} target="_blank" rel="noopener noreferrer">
                      <IconWeb platform="portfolio" />
                    </a>
                  )}
                  {userData?.rawSocialProfile?.github && (
                    <a href={userData.socialProfile.github} target="_blank" rel="noopener noreferrer">
                      <IconGithub platform="github" />
                    </a>
                  )}
                  {userData?.rawSocialProfile?.linkedin && (
                    <a href={userData.socialProfile.linkedin} target="_blank" rel="noopener noreferrer">
                      <IconLinkedIn platform="linkedin" />
                    </a>
                  )}
                  {!userData?.rawSocialProfile?.insta &&
                    !userData?.rawSocialProfile?.fb &&
                    !userData?.rawSocialProfile?.x &&
                    !userData?.rawSocialProfile?.portfolio &&
                    !userData?.rawSocialProfile?.github &&
                    !userData?.rawSocialProfile?.linkedin && (
                      <span className={styles.notAvailable}>No information available</span>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "edittab" && (
          <EditInformation onCancel={() => handleEditComplete(false)} onSuccess={() => handleEditComplete(true)} />
        )}
      </div>
    </section>
  )
}
