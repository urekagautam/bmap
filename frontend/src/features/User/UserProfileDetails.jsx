import styles from "./UserProfileDetails.module.css";
import { useState } from "react";
import { cns } from "../../utils/classNames.js";
import Tag from "../../component/Tag.jsx";
import Button from "../../component/Button.jsx";
import { IconOrganizationBuilding } from "../../component/icons/IconOrganizationBuilding.jsx";
import { IconPencil } from "../../component/icons/IconPencil";
import { IconPhone } from "../../component/icons/IconPhone";
import { IconEnvelope } from "../../component/icons/IconEnvelope";
import { IconInstagram } from "../../component/icons/IconInstagram";
import { IconFacebook } from "../../component/icons/IconFacebook";
import { IconLinkedIn } from "../../component/icons/IconLinkedIn";
import { IconGithub } from "../../component/icons/IconGithub";
import { IconWeb } from "../../component/icons/IconWeb";
import { IconX } from "../../component/icons/IconX";
import { IconStar } from "../../component/icons/IconStar.jsx";
import { IconHome } from "../../component/icons/IconHome.jsx";

export default function UserProfileDetails() {
  const [activeTab, setActiveTab] = useState("about");

  const userData = {
    fullName: "Milli Rai",
    jobTitle: "UI UX Designer",
    industry: "Information Technology",
    employeeCount: "1 (Individual)",
    address: "Mhepi Janamarga",
    district:"Kathmandu",
    phoneNum: "+1 555-123-4567",
    email: "milli@example.com",
    socialProfile: {
      insta: "https://www.instagram.com/millirai",
      fb: "https://www.facebook.com/millirai",
      x: "https://twitter.com/millirai",
      portfolio: "https://millirai.com",
      github: "https://github.com/millirai",
      /*     linkedin:"https://linkedin.com/millirai" */
    },
    aboutUser:
      "Milli is a passionate full-stack developer with over 5 years of experience building dynamic web applications. He specializes in JavaScript, React, and Node.js, with a strong background in UX/UI design. John enjoys solving complex problems and contributing to open-source projects. In his free time, he mentors junior developers and explores emerging technologies.",
    skills: ["JavaScript", "React", "Node.js"],
  };
  const firstName = userData.fullName.split(" ")[0];
  const userImageUrl = "/CompanyProfileImage.png";

  return (
    <section className={styles.userProfileSection}>
      <div className={styles.mainWrapper}>
        <div className={styles.topContainer}>
          <div className={styles.leftPart}>
            <div className={styles.userImage}>
              <img src={userImageUrl || "/placeholder.svg"} alt="User" />
            </div>

            <div className={styles.userDetails}>
              <span>{userData.fullName}</span>
              <span>{userData.address}, {userData.district}</span>
            </div>
          </div>
          <Button layout="xs" color="neutral">
            <IconPencil style={{ fontSize: "2rem" }} /> Edit Profile
          </Button>
        </div>
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
              activeTab === "resume" && styles.activeTab
            )}
            onClick={() => setActiveTab("resume")}
          >
            Resume
          </button>
          <button
            type="button"
            className={cns(
              styles.tab,
              activeTab === "application" && styles.activeTab
            )}
            onClick={() => setActiveTab("application")}
          >
            Application
          </button>
        </div>

        <div className={styles.mainContainer}>
          {activeTab === "about" && (
            <div className={styles.aboutUserWrapper}>
              <h2>About {firstName}</h2>
              <p>{userData.aboutUser}</p>

              <div className={styles.skillsContainer}>
                <div className={styles.skillsHeader}>
                  <IconOrganizationBuilding />
                  <h4>Key Skills:</h4>
                </div>
                <div className={styles.skillsTags}>
                  {userData.skills.map((skill, index) => (
                    <Tag
                      key={index}
                      data={skill}
                      layout="primary"
                      color="neutral"
                      size="md"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "resume" && (
            <div className={styles.userResumeWrapper}>THIS IS RESUME CONTAINER</div>
          )}
          {activeTab === "application" && (
            <div className={styles.userApplicationsWrapper}>THIS IS APPLICATIONS CONTAINER</div>
          )}
          <div className={styles.companyOtherInfo}>
            <h2>User Information</h2>
            <div className={styles.infoList}>
              <span>
                <IconStar />
                {userData.industry}
              </span>
              <span className={styles.showLocation}>
                <span className={styles.locationDetails}>
                  <IconHome />
                  {userData.address}
                </span>
              </span>
              <span>
                <IconPhone />
                {userData.phoneNum}
              </span>
              <span>
                <IconEnvelope />
                {userData.email}
              </span>
            </div>

            <div className={styles.socialInfo}>
              <h4>Social Media</h4>
              <div className={styles.socialsList}>
                {userData?.socialProfile?.insta && (
                  <a
                    href={userData.socialProfile.insta}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconInstagram platform="instagram" />
                  </a>
                )}
                {userData?.socialProfile?.fb && (
                  <a
                    href={userData.socialProfile.fb}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconFacebook platform="facebook" />
                  </a>
                )}
                {userData?.socialProfile?.x && (
                  <a
                    href={userData.socialProfile.x}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconX platform="x" />
                  </a>
                )}
                {userData?.socialProfile?.portfolio && (
                  <a
                    href={userData.socialProfile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconWeb platform="portfolio" />
                  </a>
                )}
                {userData?.socialProfile?.github && (
                  <a
                    href={userData.socialProfile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconGithub platform="github" />
                  </a>
                )}
                {userData?.socialProfile?.linkedin && (
                  <a
                    href={userData.socialProfile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconLinkedIn platform="linkedin" />
                  </a>
                )}
                {!userData?.socialProfile?.insta &&
                  !userData?.socialProfile?.fb &&
                  !userData?.socialProfile?.x && (
                    <span className={styles.notAvailable}>
                      No information available
                    </span>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
