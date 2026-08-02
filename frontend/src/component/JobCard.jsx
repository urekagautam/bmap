import styles from "./JobCard.module.css";
import { IconEyeOpen } from "./icons/IconEyeOpen.jsx";
import { IconHourglass } from "./icons/IconHourglass.jsx";
import { IconLightBulb } from "./icons/IconLightBulb.jsx";
import { IconLocationPinned } from "./icons/IconLocationPinned.jsx";
import Tag from "./Tag.jsx";
import { IconChartLinedUp } from "./icons/IconChartLinedUp.jsx";
import { IconChartBar } from "./icons/IconChartBar.jsx";
import { IconClock } from "./icons/IconClock.jsx";
import { IconBills } from "./icons/IconBills.jsx";
import { Link } from "react-router-dom"

export default function JobCard({
  deadline,
  views,
  title,
  company,
  salaryMin,
  salaryMax,
  jobType,
  jobMode,
  level,
  experienceDuration,
  skills = [],
  location,
  jobId,
  organizationId,
  logoSrc,
  // New props for actual data structure
  salary,
  jobByTime,
  jobByLocation,
  jobLevel,
  experience,
  skillsRequired = [],
  department,
}) {
  // Format salary display
  const formatSalary = () => {
    if (!salary) return "Salary not specified";
    
    if (salary.type === "fixed") {
      return `Rs. ${salary.min || 0}`;
    } else if (salary.type === "range") {
      return `Rs. ${salary.min || 0} - Rs. ${salary.max || 0}`;
    }
    return "Salary not specified";
  };

  // Format job type and location
  const formatJobType = () => {
    const timeType = jobByTime || jobType || "fulltime";
    const locationType = jobByLocation || jobMode || "on_site";
    return `${timeType} • ${locationType}`;
  };

  // Format experience
  const formatExperience = () => {
    if (!experience && !experienceDuration) return "Experience not specified";
    return experience || experienceDuration || "Experience not specified";
  };

  // Format deadline
  const formatDeadline = () => {
    if (!deadline) return "No deadline specified";
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString();
    } catch (error) {
      return deadline;
    }
  };

  // Format location
  const formatLocation = () => {
    if (!location) return "Location not specified";
    return location;
  };

  // Format skills
  const displaySkills = skillsRequired.length > 0 ? skillsRequired : skills;

  return (
    <Link to={`/view-jobdescription/${jobId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={styles.mainWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.topMainWrapper}>
            <div className={styles.topLWrapper}>
              <img
                className={styles.loginimg}
                src={logoSrc || "/RandomImage.png"}
                alt="Company Logo"
              />
            </div>
            <div className={styles.topRWrapper}>
              <h1>{title || "Job Title"}</h1>
              <h2>{company || "Company"}</h2>

              <div className={styles.skillsWrapper}>
                <IconLocationPinned />
                <h3>{formatLocation()}</h3>
              </div>

              {displaySkills.length > 0 && (
                <div className={styles.skillsWrapper}>
                  <IconLightBulb />
                  <h3>Key Skills:</h3>
                  {displaySkills.slice(0, 3).map((skill, index) => (
                    <Tag key={index} data={skill} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.jobDetailsWrapper}>
          <div className={styles.jobDetails}>
            <IconBills />
            <span>{formatSalary()}</span>
          </div>
          <div className={styles.jobDetails}>
            <IconChartBar />
            <span>{jobLevel || level || "Level not specified"}</span>
          </div>
          <div className={styles.jobDetails}>
            <IconClock />
            <span>{formatJobType()}</span>
          </div>
          <div className={styles.jobDetails}>
            <IconChartLinedUp />
            <span>{formatExperience()}</span>
          </div>
        </div>
        <div className={styles.bottomMainWrapper}>
          <div className={styles.bottomLWrapper}>
            <IconHourglass />
            <h3>Apply Before: {formatDeadline()}</h3>
          </div>

          <div className={styles.bottomRWrapper}>
            <IconEyeOpen />
            <h3>{views || 0}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
}