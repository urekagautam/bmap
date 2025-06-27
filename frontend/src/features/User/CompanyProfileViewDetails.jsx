import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import styles from "../Organization/CompanyProfile.module.css"
import Button from "../../component/Button.jsx"
import { cns } from "../../utils/classNames.js"
import { IconAdd } from "../../component/icons/IconAdd.jsx"
import AboutTab from "./orgprofile/AboutTab.jsx"
import JobsTab from "./orgprofile/JobsTab.jsx"
import { useOrgData } from "../../hooks/useOrgData.js"
import {
  apiFollowOrganization,
  apiUnfollowOrganization,
  apiCheckFollowStatus,
  apiGetOrganizationFollowerCount,
} from "../../services/apiFollow.js"

export default function CompanyProfileViewDetails() {
  const { id: orgId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followerCountLoading, setFollowerCountLoading] = useState(true)

  const initialTab = searchParams.get("tab") || "about"
  const [activeTab, setActiveTab] = useState(initialTab)

  const { orgData, isLoading, error } = useOrgData(orgId)

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    if (newTab === "about") {
      searchParams.delete("tab")
    } else {
      searchParams.set("tab", newTab)
    }
    setSearchParams(searchParams)
  }

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "about"
    setActiveTab(tabFromUrl)
  }, [searchParams])

  // Formatting follower count for display
  const formatFollowerCount = (count) => {
    if (count === 0) return "0 Followers"
    if (count === 1) return "1 Follower"
    if (count < 1000) return `${count} Followers`
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K Followers`
    return `${(count / 1000000).toFixed(1)}M Followers`
  }

  // Fetching follower count
  const fetchFollowerCount = async () => {
    if (!orgId) return

    try {
      setFollowerCountLoading(true)
      const response = await apiGetOrganizationFollowerCount(orgId)
      setFollowerCount(response.data.followerCount)
    } catch (error) {
      console.error("Error fetching follower count:", error)
      setFollowerCount(0)
    } finally {
      setFollowerCountLoading(false)
    }
  }

  // Handling follow/unfollow
  const handleFollowToggle = async () => {
    setIsFollowLoading(true)
    try {
      let response

      if (isFollowing) {
        response = await apiUnfollowOrganization(orgId)
        setIsFollowing(false)
        toast.success(`Unfollowed ${orgData?.orgName || "organization"}!`)
      } else {
        response = await apiFollowOrganization(orgId)
        setIsFollowing(true)
        toast.success(`Following ${orgData?.orgName || "organization"}!`)
      }

      // Updating follower count from API response
      if (response.data.followerCount !== undefined) {
        setFollowerCount(response.data.followerCount)
      } else {
        // Fallback: refetching follower count
        fetchFollowerCount()
      }

      console.log("API Response:", response)
    } catch (error) {
      console.error(" Error toggling follow status:", error)
      const errorMessage = error.response?.data?.message || "Failed to update follow status"
      toast.error(errorMessage)
    } finally {
      setIsFollowLoading(false)
    }
  }

  // Checking follow status on mount
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!orgId) return

      try {
        const response = await apiCheckFollowStatus(orgId)
        setIsFollowing(response.data.isFollowing)

        // Updating follower count if available in response
        if (response.data.followerCount !== undefined) {
          setFollowerCount(response.data.followerCount)
          setFollowerCountLoading(false)
        }

        console.log(" Follow status:", response.data.isFollowing)
      } catch (error) {
        console.error(" Error checking follow status:", error)
        setIsFollowing(false)
      }
    }

    checkFollowStatus()
  }, [orgId])

  // Fetching follower count on mount
  useEffect(() => {
    fetchFollowerCount()
  }, [orgId])

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

  if (isLoading) {
    return (
      <section className={styles.heroSection}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}>Loading company profile...</div>
        </div>
      </section>
    )
  }

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
              className={cns(styles.followButton, isFollowing && styles.following)}
              onClick={handleFollowToggle}
              fill={isFollowing ? "solid" : "outline"}
              layout="sm"
              color={isFollowing ? "primary" : "neutralLight"}
              disabled={isFollowLoading}
            >
              <IconAdd />
              {isFollowLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
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
            <h3 className={styles.followers}>
              {followerCountLoading ? "Loading..." : formatFollowerCount(followerCount)}
            </h3>
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
        </section>
      </section>
    </>
  )
}
