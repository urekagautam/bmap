import { useState } from "react";
import styles from "./CompanyProfile.module.css";
import Button from "../../component/Button.jsx";
import { cns } from "../../utils/classNames.js";
import { IconPencil } from "../../component/icons/IconPencil.jsx";
import AboutTab from "./profile/AboutTab.jsx";
import EditTab from "./profile/EditTab.jsx";
import JobsTab from "./profile/JobsTab.jsx";

export default function CompanyProfile() {
  const [activeTab, setActiveTab] = useState("about");
  const companyName = "TechCorp Inc.";
  const industry = "Technology";
  const employeeCount = "500-1000 employees";
  const foundedYear = "Founded 2019";
  const followerCount = "1K Followers";

  const coverImageUrl = "/CoverImage.jpg";
  const profileImageUrl = "/CompanyProfileImage.png";

  return (
    <>
      <section className={styles.heroSection}>
        <section className={styles.imagesSection}>
          <div className={styles.coverImage}>
            <img src={coverImageUrl} alt="Cover" />
          </div>
          <div className={styles.profileImage}>
            <img src={profileImageUrl} alt="Profile" />
          </div>
        </section>

        <section className={styles.mainWrapper}>
          <div className={styles.headerDivison}>
            <div className={styles.header}>
              <h1>{companyName}</h1>
              <div className={styles.companyInfo}>
                <span>{industry}</span>
                <span className={styles.dot}>•</span>
                <span>{employeeCount}</span>
                <span className={styles.dot}>•</span>
                <span>{foundedYear}</span>
              </div>
            </div>

            <Button
              className={cns(
                styles.edittab,
                activeTab === "edittab" && styles.activeEditTab
              )}
              onClick={() => setActiveTab("edittab")}
              fill="outline"
              layout="sm"
              color="neutralLight"
            >
              {" "}
              <IconPencil /> Edit Profile
            </Button>
          </div>

          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              <button
                type="button"
                className={cns(
                  styles.tab,
                  activeTab === "about" && styles.activeTab
                )}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
              <button
                type="button"
                className={cns(
                  styles.tab,
                  activeTab === "jobs" && styles.activeTab
                )}
                onClick={() => setActiveTab("jobs")}
              >
                Jobs
              </button>
            </div>
            <h3 className={styles.followers}>{followerCount}</h3>
          </div>

          {activeTab === "about" && <AboutTab setActiveTab={setActiveTab} />}

          {activeTab === "jobs" && <JobsTab />}

          {activeTab === "edittab" && <EditTab />}
        </section>
      </section>
    </>
  );
}