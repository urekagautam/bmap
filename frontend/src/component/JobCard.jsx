import styles from "./JobCard.module.css";
import { IconEyeOpen } from "./icons/IconEyeOpen.jsx";
import { IconHourglass } from "./icons/IconHourglass.jsx";
import { IconLightBulb } from "./icons/IconLightBulb.jsx";
import { IconLocation } from "./icons/IconLocation.jsx";
import SkillsTag from "./SkillsTag.jsx";

export default function JobCard({
  deadline,
  views,
  vacancyTitle,
  vacancyCompany,
  salaryMin,
  salaryMax,
  period,
  employmentType,
  level,
  experienceRequired,
  skills = [],
  location,
}) {
  return (
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
            <h1>{vacancyTitle}</h1>
            <h2>{vacancyCompany}</h2>

            <div className={styles.skillsWrapper}>
              <IconLocation />
              <h3>{location}</h3>
            </div>

            <div className={styles.skillsWrapper}>
              <IconLightBulb />
              <h3>Key Skills:</h3>
              {skills.slice(0, 3).map((skill, index) => (
                <SkillsTag key={index} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.jobDetailsWrapper}>
        <div className={styles.jobDetails}>
          <IconHourglass />
          <span>Rs. {salaryMin}</span> - <span>Rs. {salaryMax}</span>
        </div>
        <div className={styles.jobDetails}>
          <IconHourglass />
          {level}
        </div>
        <div className={styles.jobDetails}>
          <IconHourglass />
          <span>
            {" "}
            {period} • {employmentType}
          </span>
        </div>
        <div className={styles.jobDetails}>
          <IconHourglass />
          {experienceRequired}
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
  );
}
