import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./JobDescriptionDetails.module.css";
import Button from "../../component/Button.jsx";
import { IconOrganizationBuilding } from "../../component/icons/IconOrganizationBuilding";
import { IconPeople } from "../../component/icons/IconPeople";
import { IconLocationPinned } from "../../component/icons/IconLocationPinned";
import { IconPhone } from "../../component/icons/IconPhone";
import { IconEnvelope } from "../../component/icons/IconEnvelope";
import { IconInstagram } from "../../component/icons/IconInstagram";
import { IconFacebook } from "../../component/icons/IconFacebook";
import { IconX } from "../../component/icons/IconX";
import { IconClock } from "../../component/icons/IconClock";
import Tag from "../../component/Tag.jsx";
import { IconChartBar } from "../../component/icons/IconChartBar.jsx";
import { IconChartLinedUp } from "../../component/icons/IconChartLinedUp.jsx";
import { IconHourglass } from "../../component/icons/IconHourglass.jsx";
import { IconEyeOpen } from "../../component/icons/IconEyeOpen.jsx";
import { IconBills } from "../../component/icons/IconBills.jsx";
import { useNavigate } from "react-router-dom";
import { apiGetVacancyDetails } from "../../services/apiVacancy.js";
import { apiGetOrganizationDetails } from "../../services/apiOrganizationAuth.js";
import toast from "react-hot-toast";
import { cns } from "../../utils/classNames.js";
import { getFormattedCompanyInfo } from "../../utils/orgUtils.js";

export default function JobDescriptionDetails() {
  const navigate = useNavigate();
  const { id: jobId } = useParams();

  const [activeTab, setActiveTab] = useState("description");

  const parseSocialProfiles = (orgData) => {
    if (!orgData || !orgData.socialProfile) return {};

    try {
      const socialData = orgData.socialProfile;

      return {
        instagram: socialData.insta || "",
        facebook: socialData.fb || "",
        x: socialData.x || "",
      };
    } catch (error) {
      console.error("Error parsing social profiles:", error);
      return {};
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [vacancyData, setVacancyData] = useState(null);
  const [orgData, setOrgData] = useState(null);
  const [error, setError] = useState(null);

  console.log("Job ID from params:", jobId);

  const handleViewAllJobsClick = () => {
    navigate("/cmpprofile?tab=jobs");
  };

  useEffect(() => {
    async function fetchData() {
      if (!jobId) {
        setError("No job ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const vacancyResponse = await apiGetVacancyDetails(jobId);
        console.log("Vacancy API Response:", vacancyResponse);

        const vacancy =
          vacancyResponse.data?.vacancy ||
          vacancyResponse.vacancy ||
          vacancyResponse;
        setVacancyData(vacancy);

        console.log("Full vacancy data structure:", vacancy);
        console.log("Skills specifically:", vacancy.skills);
        console.log("All vacancy keys:", Object.keys(vacancy));

        if (vacancy.orgId) {
          try {
            console.log("Fetching organization details for ID:", vacancy.orgId);
            const orgResponse = await apiGetOrganizationDetails(vacancy.orgId);
            console.log("Organization API Response:", orgResponse);
            setOrgData(orgResponse);
          } catch (orgError) {
            console.error("Error fetching organization details:", orgError);
            toast.error("Could not load organization details");
          }
        }

        setError(null);
        toast.success("Job details loaded successfully!");
      } catch (err) {
        console.error("Error fetching vacancy details:", err);
        setError(err.message || "Failed to fetch job details");
        toast.error("Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [jobId]);

  // Loading state
  if (isLoading) {
    return (
      <section className={styles.heroSection}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}>Loading job details...</div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={styles.heroSection}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Job Details</h2>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </section>
    );
  }

  // No data state
  if (!vacancyData) {
    return (
      <section className={styles.heroSection}>
        <div className={styles.errorContainer}>
          <h2>Job Not Found</h2>
          <p>The requested job posting could not be found.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </section>
    );
  }

  // Formatting salary display structure ansar
  const formatSalary = () => {
    if (!vacancyData.salary) return "Negotiable";

    if (vacancyData.hideSalary) return "Confidential";

    if (vacancyData.salary.type === "fixed") {
      return `${vacancyData.salary.min}`;
    } else if (vacancyData.salary.type === "range") {
      return `${vacancyData.salary.min} - ${vacancyData.salary.max}`;
    }

    return vacancyData.salary.min || "Negotiable";
  };

  const formatDeadline = (dateString) => {
    try {
      const deadlineDate = new Date(dateString);
      const today = new Date();

      // Resetting time to start of day for accurate day calculation
      deadlineDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const timeDiff = deadlineDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff < 0) {
        return "Deadline has passed";
      } else if (daysDiff === 0) {
        return "Apply before today (last day!)";
      } else if (daysDiff === 1) {
        return "Apply before 1 day from now";
      } else if (daysDiff <= 30) {
        return `Apply before ${daysDiff} days from now`;
      } else if (daysDiff <= 365) {
        const weeksDiff = Math.ceil(daysDiff / 7);
        if (weeksDiff === 1) {
          return "Apply before 1 week from now";
        } else if (weeksDiff <= 4) {
          return `Apply before ${weeksDiff} weeks from now`;
        } else {
          const monthsDiff = Math.ceil(daysDiff / 30);
          return `Apply before ${monthsDiff} month${
            monthsDiff > 1 ? "s" : ""
          } from now`;
        }
      } else {
        return `Apply before ${deadlineDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`;
      }
    } catch {
      return dateString;
    }
  };

  const formatJobLevel = (level) => {
    if (!level) return "Not specified";
    return level
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatJobType = (type) => {
    if (!type) return "Not specified";

    const typeMap = {
      fulltime: "Full-time",
      parttime: "Part-time",
      contract: "Contract",
      internship: "Internship",
      freelance: "Freelance",
    };

    return typeMap[type] || type;
  };

  const formatJobLocation = (location) => {
    if (!location) return "Not specified";

    const locationMap = {
      on_site: "On-site",
      remote: "Remote",
      hybrid: "Hybrid",
    };

    return locationMap[location] || location;
  };

  const formatSkills = (skills) => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) return [];

    return skills.map((skill) => {
      return skill
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    });
  };

  // Temporary fallback,, skills TEST GARNAA ONLY
  const getFallbackSkills = () => {
    return ["Communication", "Problem Solving", "Team Work", "Leadership"];
  };

  const companyInfo = getFormattedCompanyInfo(orgData, vacancyData);

  const {
    companyName,
    industry,
    employeeCount,
    foundedYear,
    address,
    phonenum,
    email,
    socials,
  } = companyInfo;

  //benefits lai into two columnss ma split garne if enough is available
  /* const benefitsList = orgData?.benefits
    ? orgData.benefits.split(",").map((benefit) => benefit.trim())
    : []; */

  const coverImageUrl = "/CoverImage.jpg";
  const profileImageUrl = "/CompanyProfileImage.png";

  /*   const jobs = [
    {
      title: "Software Engineer",
      locationType: "Remote",
      employmentType: "Full-time",
    },
    {
      title: "Data Scientist",
      locationType: "On-site",
      employmentType: "Full-time",
    },
  ]; */

  const deadlineDate = new Date(vacancyData?.deadline);
  const today = new Date();
  const timeDiff = deadlineDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const deadlineClass =
    daysDiff <= 0
      ? styles.expiredDeadline
      : daysDiff <= 1
      ? styles.urgentDeadline
      : daysDiff <= 3
      ? styles.soonDeadline
      : "";

  return (
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

          <div className={styles.buttons}>
            <Link to={`/updatevacancy/${jobId}`}>
            <Button className={styles.updateBtn} layout="xs">
              Update
            </Button>
            </Link>
            <Button
              className={styles.updateBtn}
              layout="sm"
              fill="text"
              color="neutralLight"
            >
              Delete
            </Button>
          </div>
        </div>

        <div className={styles.aboutContent}>
          <div className={styles.jobDescriptionWrapper}>
            <div className={styles.cardWrapper}>
              <div className={styles.cardHeader}>
                <h1>{vacancyData.title}</h1>
                <div className={styles.viewCount}>
                  <IconEyeOpen />
                  <span>{vacancyData.views || 0}</span>
                </div>
              </div>

              <div className={styles.tagsContainer}>
                <Tag
                  data={formatJobType(vacancyData.jobByTime)}
                  icon={<IconClock />}
                  layout="primary"
                  color="blue"
                  size="md"
                />

                <Tag
                  data={`Rs. ${formatSalary()} ${
                    vacancyData.salaryPeriod || "Monthly"
                  }`}
                  icon={<IconBills />}
                  layout="success"
                  color="green"
                  size="md"
                />
              </div>

              <div className={styles.detailsContainer}>
                <div className={styles.detailItem}>
                  <IconLocationPinned />
                  <span>{address}</span>
                </div>

                <div className={styles.detailItem}>
                  <IconChartBar />
                  <span>{formatJobLevel(vacancyData.jobLevel)}</span>
                </div>
              </div>

              <div className={styles.detailsContainer}>
                <div className={styles.detailItem}>
                  <IconChartLinedUp />
                  <span>
                    {vacancyData.isExperienceRequired
                      ? "Experience Required"
                      : "No Experience Required"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <IconClock />
                  <span>{formatJobLocation(vacancyData.jobByLocation)}</span>
                </div>
              </div>

              <div className={`${styles.bottomLWrapper} ${deadlineClass}`}>
                <IconHourglass />
                <h3>{formatDeadline(vacancyData.deadline)}</h3>
              </div>
            </div>

            <div className={styles.jobInfo}>
              <div className={styles.tabs}>
                <button
                  type="button"
                  className={cns(
                    styles.tab,
                    activeTab === "description" && styles.activeTab
                  )}
                  onClick={() => setActiveTab("description")}
                >
                  Decscription
                </button>
                <button
                  type="button"
                  className={cns(
                    styles.tab,
                    activeTab === "requirements" && styles.activeTab
                  )}
                  onClick={() => setActiveTab("requirements")}
                >
                  Requirements
                </button>
              </div>

              <Link to={`/jobapplication/${jobId}`}>
                <Button>Apply Now</Button>
              </Link>

              {activeTab === "description" && (
                <div className={styles.description}>
                  <h3>Job Description</h3>
                  <p>{vacancyData.description}</p>
                </div>
              )}

              {activeTab === "requirements" && (
                <div className={styles.requirement}>
                  <h3>Requirements</h3>
                  <div className={styles.requirementsList}>
                    <ul>
                      {vacancyData.additionalInfo
                        .split(",")
                        .map((requirement, index) => (
                          <li key={index}>{requirement.trim()}</li>
                        ))}
                    </ul>
                  </div>

                  <div className={styles.skillsContainer}>
                    <div className={styles.skillsHeader}>
                      <IconOrganizationBuilding />
                      <h4>Key Skills:</h4>
                    </div>
                    <div className={styles.skillsTags}>
                      {(() => {
                        const skills =
                          vacancyData.skills || getFallbackSkills();
                        return formatSkills(skills).map((skill, index) => (
                          <Tag
                            key={index}
                            data={skill}
                            layout="primary"
                            color="neutral"
                            size="md"
                          />
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.infoAndHiring}>
            <div className={styles.companyOtherInfo}>
              <h2>Company Information</h2>
              <div className={styles.infoList}>
                <span>
                  <IconOrganizationBuilding />
                  {industry}
                </span>
                <span>
                  <IconPeople />
                  {employeeCount}
                </span>
                <span className={styles.showLocation}>
                  <span className={styles.locationDetails}>
                    <IconLocationPinned />
                    {address}
                  </span>
                </span>
                <span>
                  <IconPhone />
                  {phonenum}
                </span>
                <span>
                  <IconEnvelope />
                  {email}
                </span>
              </div>

              <div className={styles.socialInfo}>
                <h4>Social Media</h4>
                <div className={styles.socialsList}>
                  {orgData?.socialProfile?.insta && (
                    <a
                      href={orgData.socialProfile.insta}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconInstagram platform="instagram" />
                    </a>
                  )}
                  {orgData?.socialProfile?.fb && (
                    <a
                      href={orgData.socialProfile.fb}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconFacebook platform="facebook" />
                    </a>
                  )}
                  {orgData?.socialProfile?.x && (
                    <a
                      href={orgData.socialProfile.x}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconX platform="x" />
                    </a>
                  )}
                  {!orgData?.socialProfile?.insta &&
                    !orgData?.socialProfile?.fb &&
                    !orgData?.socialProfile?.x && (
                      <span className={styles.notAvailable}>
                        No information available
                      </span>
                    )}
                </div>
              </div>
            </div>

            {/*  <div className={styles.jobsSection}>
              <h2>Now Hiring</h2>
              <div className={styles.jobsList}>
                {jobs.map((job, index) => (
                  <div key={index} className={styles.jobCard}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <div className={styles.jobLocation}>
                      <IconClock />
                      <span>
                        {job.locationType} • {job.employmentType}
                      </span>
                    </div>
                    <div className={styles.viewJobButton}>
                      <Button layout="sm" color="primary" fill="text">
                        View Job
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.viewAllJobsButton}>
                <Button type="button" layout="sm" color="neutralLight" fill="outline" onClick={handleViewAllJobsClick}>
                  View all Jobs
                </Button>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </section>
  );
}
