import { cns } from "../utils/classNames.js";
import { IconClock } from "./icons/IconClock.jsx";
import { IconBills } from "./icons/IconBills.jsx";
import { IconHourglass } from "./icons/IconHourglass.jsx";
import { IconLocationPinned } from "./icons/IconLocationPinned.jsx";
import { IconChartLinedUp } from "./icons/IconChartLinedUp.jsx";
import { IconChartBar } from "./icons/IconChartBar.jsx";
import { IconEyeOpen } from "./icons/IconEyeOpen.jsx";
import Tag from "./Tag.jsx";
import styles from "./JobDetailCard.module.css";

export default function JobDetailCard({
  title,
  salary,
  deadline,
  location,
  experience,
  level,
  jobType,
  jobMode,
  views,
}) {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardHeader}>
        <h1>{title}</h1>
        <div className={styles.viewCount}>
          <IconEyeOpen />
          <span>{views}</span>
        </div>
      </div>

      <div className={styles.tagsContainer}>
        <Tag
          data={jobType}
          icon={<IconClock />}
          layout="primary"
          color="blue"
          size="md"
        />

        <Tag
          data={`Rs. ${salary} Monthly`}
          icon={<IconBills />}
          layout="success"
          color="green"
          size="md"
        />
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.detailItem}>
          <IconLocationPinned />
          <span>{location}</span>
        </div>

        <div className={styles.detailItem}>
          <IconChartBar />
          <span>{level}</span>
        </div>
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.detailItem}>
          <IconChartLinedUp />
          <span>{experience}</span>
        </div>
        <div className={styles.detailItem}>
          <IconClock />
          <span>{jobMode}</span>
        </div>
      </div>

      <div className={styles.bottomLWrapper}>
        <IconHourglass />
        <h3>Apply Before: {deadline}</h3>
      </div>
    </div>
  );
}
