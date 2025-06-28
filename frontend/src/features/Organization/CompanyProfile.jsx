import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import styles from "./CompanyProfile.module.css"
import Button from "../../component/Button.jsx"
import { cns } from "../../utils/classNames.js"
import { IconPencil } from "../../component/icons/IconPencil.jsx"
import AboutTab from "./profile/AboutTab.jsx"
import EditTab from "./profile/EditTab.jsx"
import JobsTab from "./profile/JobsTab.jsx"
import { useOrgData } from "../../hooks/useOrgData.js"
import OrganizationNavbar from "../../component/OrganizationNavBar.jsx"
import { 
  FIELD_OF_EXPERTISE_OPTIONS,
  INDUSTRY_OPTIONS 
} from "../../constants/constants.js"
import toast from "react-hot-toast"

export default function CompanyProfile() {
  const { id: orgId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Getting initial tab from URL params, default to "about"
  const initialTab = searchParams.get("tab") || "about"
  const [activeTab, setActiveTab] = useState(initialTab)
  const { orgData, isLoading, error, refetch } = useOrgData(orgId) 

  // Updating URL when tab changes
  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    if (newTab === "about") {
      
      searchParams.delete("tab")
    } else {
      searchParams.set("tab", newTab)
    }
    setSearchParams(searchParams)
  }

  // Handling cancel from EditTab
  const handleCancelEdit = () => {
    handleTabChange("about") 
  }

  const handleUpdateSuccess = () => {
    toast.success("Profile updated successfully!")
    handleTabChange("about") 
   
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  // Updating activeTab when URL changes (browser back/forward)
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "about"
    setActiveTab(tabFromUrl)
  }, [searchParams])

  // Function to get specialty labels from values
  const getSpecialtyLabels = (specialties) => {
    if (!specialties || !Array.isArray(specialties)) return []
    
    return specialties.map(specialty => {
      const found = FIELD_OF_EXPERTISE_OPTIONS.find(option => option.value === specialty)
      return found ? found.label : specialty 
    })
  }

  // Function to get industry label from value
  const getIndustryLabel = (industryValue) => {
    if (!industryValue) return "Not Specified"
    
    const found = INDUSTRY_OPTIONS.find(option => option.value === industryValue)
    return found ? found.label : industryValue 
  }

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
  const industry = getIndustryLabel(orgData?.industry) 
  const employeeCount = formatCompanySize(orgData)
  const foundedYear = orgData?.foundedYear || "N/A"
  const address = orgData?.address || "Address not specified"
  const phonenum = orgData?.phoneNo || "Phone not specified"
  const email = orgData?.email || "Email not specified"
  const socials = parseSocialProfiles(orgData)
  const description = orgData?.description || ""
  const specialities = getSpecialtyLabels(orgData?.specialities || []) 
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
      <OrganizationNavbar />
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
              onClick={() => handleTabChange("edittab")}
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
                onClick={() => handleTabChange("about")}
              >
                About
              </button>
              <button
                type="button"
                className={cns(styles.tab, activeTab === "jobs" && styles.activeTab)}
                onClick={() => handleTabChange("jobs")}
              >
                Jobs
              </button>
            </div>
            {/* <h3 className={styles.followers}>{followerCount}</h3> */}
          </div>

          {activeTab === "about" && (
            <AboutTab
              setActiveTab={handleTabChange}
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

          {activeTab === "edittab" && (
            <EditTab 
              orgData={orgData}
              onCancel={handleCancelEdit}
              onUpdateSuccess={handleUpdateSuccess}
            />
          )}
        </section>
      </section>
    </>
  )
}