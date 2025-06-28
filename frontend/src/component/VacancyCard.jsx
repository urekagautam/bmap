import { cns } from "../utils/classNames.js";
import { IconEyeOpen } from "./icons/IconEyeOpen.jsx";
import { IconHourglass } from "./icons/IconHourglass.jsx";
import { IconLightBulb } from "./icons/IconLightBulb.jsx";
import styles from "./VacancyCard.module.css";
import Tag from "./Tag.jsx";
import { Link } from "react-router-dom";

export default function VacancyCard({
  id,
  deadline,
  views,
  vacancyTitle,
  vacancyCompany,
  skills = [],
}) {

  return (
    <Link to={`/view-jobdescription/${id}`}>
    <div className={styles.mainWrapper}>
      <div className={styles.shrinkWrapper}>
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
              <IconLightBulb />
              <h3>Key Skills:</h3>
              {skills.slice(0, 3).map((skill, index) => (
                <Tag key={index} data={skill} />
              ))}
            </div>
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
    </div>
    </Link>
  );
}
