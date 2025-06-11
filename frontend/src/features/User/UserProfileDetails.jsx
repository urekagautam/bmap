import styles from "./UserProfileDetails.module.css";
import { useState, useEffect } from "react";
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
import { apiGetUserProfile } from "../../services/apiAuth.js";
import useUserAuth from "../../hooks/useUserAuth.js";
import EditInformation from "./profile/EditInformation.jsx"

export default function UserProfileDetails() {
  const { userId } = useUserAuth();
  const [activeTab, setActiveTab] = useState("about");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userIdToFetch = userId;

        const response = await apiGetUserProfile(userIdToFetch);

        const transformedData = {
          fullName: response.data.name || "Unknown User",
          jobTitle: response.data.job_preference?.title || "Preferred Industry not specified",
          employeeCount: "1 (Individual)",
          address: response.data.address || "Address not provided",
          district: "Kathmandu",
          phoneNum: response.data.phone || "Phone not provided",
          email: response.data.email || "Email not provided",
          socialProfile: {
            insta: response.data.socialProfile?.insta || null,
            fb: response.data.socialProfile?.fb || null,
            x: response.data.socialProfile?.x || null,
            portfolio: response.data.socialProfile?.portfolio || null,
            github: response.data.socialProfile?.github || null,
            linkedin: response.data.socialProfile?.linkedin || null,
          },
          aboutUser:
            response.data.about ||
            "This user is a passionate full-stack developer with over 5 years of experience building dynamic web applications. He specializes in JavaScript, React, and Node.js, with a strong background in UX/UI design. John enjoys solving complex problems and contributing to open-source projects. In his free time, he mentors junior developers and explores emerging technologies.",
          skills: response.data.job_preference?.skills || [
            "JavaScript",
            "React",
            "Node.js",
          ],
        };
        setUserData(transformedData);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Loading state
  if (loading) {
    return (
      <section className={styles.userProfileSection}>
        <div className={styles.mainWrapper}>
          <div className={styles.loadingContainer}>
            <p>Loading user profile...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={styles.userProfileSection}>
        <div className={styles.mainWrapper}>
          <div className={styles.errorContainer}>
            <p>Error: {error}</p>
            <Button
              layout="xs"
              color="primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!userData) {
    return (
      <section className={styles.userProfileSection}>
        <div className={styles.mainWrapper}>
          <div className={styles.noDataContainer}>
            <p>No user data available</p>
          </div>
        </div>
      </section>
    );
  }

  const firstName = userData.fullName.split(" ")[0];
  const userImageUrl = "/CompanyProfileImage.png"; /* LATER */

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
              <span>
                {userData.address}, {userData.district}
              </span>
            </div>
          </div>
            <Button
              className={cns(styles.edittab, activeTab === "edittab" && styles.activeEditTab)}
              onClick={() => setActiveTab("edittab")}
              fill="outline"
              layout="xs"
              color="neutral"
            >
              <IconPencil style={{ fontSize: "2rem" }}/> Edit Profile
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

         {activeTab != "edittab" &&(
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
                  {userData.skills && Array.isArray(userData.skills) ? (
                    userData.skills.length > 0 ? (
                      userData.skills.map((skill, index) => (
                        <Tag
                          key={index}
                          data={skill}
                          layout="primary"
                          color="neutral"
                          size="md"
                        />
                      ))
                    ) : (
                      <p className={styles.notAvailable}>Not provided</p>
                    )
                  ) : (
                    <p className={styles.notAvailable}>Not provided</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "resume" && (
            <div className={styles.userResumeWrapper}>
              THIS IS RESUME CONTAINER
            </div>
          )}
          {activeTab === "application" && (
            <div className={styles.userApplicationsWrapper}>
              THIS IS APPLICATIONS CONTAINER
            </div>
          )}

          <div className={styles.companyOtherInfo}>
            <h2>User Information</h2>
            <div className={styles.infoList}>
              <span>
                <IconStar />
                {userData.jobTitle}
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
                  !userData?.socialProfile?.x &&
                  !userData?.socialProfile?.portfolio &&
                  !userData?.socialProfile?.github &&
                  !userData?.socialProfile?.linkedin && (
                    <span className={styles.notAvailable}>
                      No information available
                    </span>
                  )}
              </div>
            </div>
          </div>
        </div>
         )}

             {activeTab === "edittab" && <EditInformation />}
      </div>
    </section>
  );
}
