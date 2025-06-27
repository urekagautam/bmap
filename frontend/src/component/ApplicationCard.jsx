import { Link } from "react-router-dom";
import styles from "./ApplicationCard.module.css";
import { IconClock } from "./icons/IconClock";
import { IconEyeOpen } from "./icons/IconEyeOpen";
import Tag from "./Tag.jsx";

export default function ApplicationCard() {
  const userImageUrl = "/CompanyProfileImage.png";
  const jobTitle="Senior Developer";
  const appliedCompany="Tech Corps";
  return (
    <div className={styles.container}>
      <div className={styles.leftPart}>
        <div className={styles.topPart}>
          <div className={styles.userImage}>
            <img src={userImageUrl || "/placeholder.svg"} alt="User" />
          </div>

          <div className={styles.userDetails}>
            <span>{jobTitle}</span>
            <span>{appliedCompany}</span>
          </div>
        </div>

        <div className={styles.bottomPart}>
          <Tag data="Shortlisted" color="skin" size="md" />
          <Tag data="1 week, 3 days from today" icon={<IconClock />} />
          <span className={styles.lastApplied}>Applied 30min ago</span>
        </div>
      </div>
      <Link to="/">
        <IconEyeOpen />
      </Link>
    </div>
  );
}
