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
}) {
  return (
    <Link to="/jobdescription">
    <div className={styles.mainWrapper}>
      <div className={styles.wrapper}>
        <div className={styles.topMainWrapper}>
          <div className={styles.topLWrapper}>
            <img
              className={styles.loginimg}
              src="/RandomImage.png"
              alt="RandomImage"
            />
          </div>
          <div className={styles.topRWrapper}>
            <h1>{title}</h1>
            <h2>{company}</h2>

            <div className={styles.skillsWrapper}>
              <IconLocationPinned />
              <h3>{location}</h3>
            </div>

            <div className={styles.skillsWrapper}>
              <IconLightBulb />
              <h3>Key Skills:</h3>
              {skills.slice(0, 3).map((skill, index) => (
                <Tag key={index} data={skill} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.jobDetailsWrapper}>
        <div className={styles.jobDetails}>
          <IconBills />
          <span>Rs. {salaryMin}</span> - <span>Rs. {salaryMax}</span>
        </div>
        <div className={styles.jobDetails}>
          <IconChartBar />
          {level}
        </div>
        <div className={styles.jobDetails}>
          <IconClock />
          <span>
            {jobType} • {jobMode}
          </span>
        </div>
        <div className={styles.jobDetails}>
          <IconChartLinedUp />
          {experienceDuration}
        </div>
      </div>
      <div className={styles.bottomMainWrapper}>
        <div className={styles.bottomLWrapper}>
          <IconHourglass />
          <h3>Apply Before: {deadline}</h3>
        </div>

        <div className={styles.bottomRWrapper}>
          <IconEyeOpen />
          <h3>{views}</h3>
        </div>
      </div>
    </div>
    </Link>
  );
}