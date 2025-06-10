import { useState } from "react"
import styles from "./CompanyProfile.module.css"
import Button from "../../component/Button.jsx"
import { cns } from "../../utils/classNames.js"
import { IconPencil } from "../../component/icons/IconPencil.jsx"
import AboutTab from "./profile/AboutTab.jsx"
import EditTab from "./profile/EditTab.jsx"
import JobsTab from "./profile/JobsTab.jsx"
import { useParams } from "react-router-dom"
import { useOrgData } from "../../hooks/useOrgData.js"

export default function CompanyProfile() {
  const { id: orgId } = useParams()
  const [activeTab, setActiveTab] = useState("about")

  const { orgData, isLoading, error } = useOrgData(orgId)

  // console.log("OrgData in CompanyProfile:", orgData)

  const formatCompanySize = (orgData) => {
    if (!orgData) return "Not specified"

    if (orgData.companySize === "fixed" && orgData.minEmployees) {
      return `${orgData.minEmployees} employees`
    } else if (orgData.companySize === "range" && orgData.minEmployees && orgData.maxEmployees) {
      return `${orgData.minEmployees}-${orgData.maxEmployees} employees`
    }

    return "Not specified"
  }

  const parseSocialProfiles = (orgData) => {
    if (!orgData || !orgData.socialProfile) return {}

    try {
      const socialData = orgData.socialProfile

      return {
        instagram: socialData.insta || "",
        facebook: socialData.fb || "",
        x: socialData.x || "",
      }
    } catch (error) {
      console.error("Error parsing social profiles:", error)
      return {}
    }
  }

  const companyName = orgData?.orgName || "Company XYZ"
  const industry = orgData?.industry || "Not Specified"
  const employeeCount = formatCompanySize(orgData)
  const foundedYear = orgData?.foundedYear || "N/A"
  const address = orgData?.address || "Address not specified"
  const phonenum = orgData?.phoneNo || "Phone not specified" 
  const email = orgData?.email || "Email not specified"
  const socials = parseSocialProfiles(orgData)
  const description = orgData?.description || ""
  const specialities = orgData?.specialities || []
  const ownerName = orgData?.ownersName || ""
  const district = orgData?.district || ""

  const coverImageUrl = "/CoverImage.jpg"
  const profileImageUrl = "/CompanyProfileImage.png"
  const followerCount = "1K Followers"

  // Loading state
  if (isLoading) {
    return (
      <section className={styles.heroSection}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}>Loading company profile...</div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className={styles.heroSection}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Company Profile</h2>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className={styles.heroSection}>
        <section className={styles.imagesSection}>
          <div className={styles.coverImage}>
            <img src={coverImageUrl || "/placeholder.svg"} alt="Cover" />
          </div>
          <div className={styles.profileImage}>
            <img src={profileImageUrl || "/placeholder.svg"} alt="Profile" />
          </div>
        </section>

        <section className={styles.mainWrapper}>
          <div className={styles.headerDivison}>
            <div className={styles.header}>
              <h1>{companyName}</h1>
              <div className={styles.companyInfo}>
                <span>{industry}</span>
                {employeeCount !== "Not specified" && (
                  <>
                    <span className={styles.dot}>•</span>
                    <span>{employeeCount}</span>
                  </>
                )}
                {foundedYear !== "N/A" && (
                  <>
                    <span className={styles.dot}>•</span>
                    <span>Founded {foundedYear}</span>
                  </>
                )}
              </div>
            </div>

            <Button
              className={cns(styles.edittab, activeTab === "edittab" && styles.activeEditTab)}
              onClick={() => setActiveTab("edittab")}
              fill="outline"
              layout="sm"
              color="neutralLight"
            >
              <IconPencil /> Edit Profile
            </Button>
          </div>

          <div className={styles.tabsContainer}>
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
                className={cns(styles.tab, activeTab === "jobs" && styles.activeTab)}
                onClick={() => setActiveTab("jobs")}
              >
                Jobs
              </button>
            </div>
            <h3 className={styles.followers}>{followerCount}</h3>
          </div>

          {activeTab === "about" && (
            <AboutTab
              setActiveTab={setActiveTab}
              orgData={orgData}
              companyInfo={{
                companyName,
                industry,
                employeeCount,
                foundedYear,
                address,
                phonenum,
                email,
                socials,
                description,
                specialities,
                ownerName,
                district,
              }}
            />
          )}

          {activeTab === "jobs" && <JobsTab />}

          {activeTab === "edittab" && <EditTab />}
        </section>
      </section>
    </>
  )
}
